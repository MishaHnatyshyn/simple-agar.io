import Player from '../shared/player';
import player from '../shared/player';
import Field from './field';
import {INetworkChannel} from './networkChannel.interface';
import {ClientMessage, ClientMessageType, ServerMessageType} from '../shared/message.interface';
import {getRandomColor} from '../shared/utils';
import FoodGenerator from './foodGenerator';
import {TopPlayer} from "../shared/topPlayers.interface";
import {PlayerValidation} from "../shared/playerValidation";
import Timer = NodeJS.Timer;
import Timeout = NodeJS.Timeout;
import ObjectInteractionManager from "./objectInteractionManager";

export default class Game {
  private DEFAULT_PLAYER_RADIUS: number = 15;
  private timer: Timer = null;
  private updateInterval: Timeout = null;
  private players: Player[] = [];
  constructor(
    private field: Field,
    private networkChannel: INetworkChannel,
    private foodGenerator: FoodGenerator,
    private objectInteractionManager: ObjectInteractionManager
  ) {}

  public start(): void {
    this.networkChannel.attachMessageHandler(this.handleNewPlayerMessage.bind(this))
    this.networkChannel.attachDisconnectHandler(this.handlePlayerExit.bind(this))
    this.startRound();
  }

  public finishRound(): void {
    this.foodGenerator.stopGeneratingFood();
    clearInterval(this.updateInterval);
    this.field.clearField();
    const topPlayers = this.getTopTenPlayers();
    const message = {
      type: ServerMessageType.FINISH_ROUND,
      data: {
        topPlayers
      }
    }
    this.networkChannel.sendMessageToAllPlayers(message);
    this.players = [];
    this.startRound();
  }

  public startRound(): void {
    this.foodGenerator.generateInitialFood();
    const message = {
      type: ServerMessageType.START_NEW_ROUND,
      data: {}
    }
    this.networkChannel.sendMessageToAllPlayers(message);
    this.updateInterval = setInterval(this.sendFieldUpdateToPlayers.bind(this), 1000 / 30);
    this.foodGenerator.startGeneratingFood();

    this.timer = setTimeout(this.finishRound.bind(this), 1000 * 60 * 2)
  }

  private handleNewPlayerMessage(message: ClientMessage, id: string): void {
    switch (message.type) {
      case ClientMessageType.START_GAME:
        this.handleNewPlayer(message.data.name, id);
        break;
      case ClientMessageType.CHANGE_DIRECTION:
        const { direction } = message.data;
        this.handlePlayerPositionUpdate(id, direction);
        break;
    }
  }

  private handlePlayerExit(id: string): void {
    const playerToDelete = this.players.find(player => player.id === id);
    if(!playerToDelete){
      return;
    }
    this.players = this.players.filter(player => player !== playerToDelete);
    this.field.removeObject(playerToDelete);
  }

  private handleNewPlayer(name: string, id: string): void {
    const validation = this.isUniqueUsername(name) ? PlayerValidation.valid : PlayerValidation.invalid;
    const message = {type: ServerMessageType.PLAYER_VALIDATION, data: {validation}};
    this.networkChannel.sendMessageToPlayer(id, message);

    if(validation === PlayerValidation.valid) {
      const color = getRandomColor();
      const player = new Player(name, id, this.DEFAULT_PLAYER_RADIUS, color);
      this.players.push(player);
      this.field.addObject(player);
    }
  }

  private isUniqueUsername(name: string): boolean {
    return name && !this.players.some((player) => player.name === name);
  }

  private sendFieldUpdateToPlayers(): void {
    const players = this.players;
    players.forEach((player: Player) => this.objectInteractionManager.handlePlayerInteraction(player));
    players.forEach(this.gatherDataAndSendUpdateToPlayer.bind(this))
    this.players = this.players.filter(player => !player.isDead)
  }

  private gatherDataAndSendUpdateToPlayer(player: Player): void {
    if (player.isDead) {
      return this.networkChannel.sendMessageToPlayer(player.id, {
        type: ServerMessageType.GAME_OVER,
        data: {}
      })
    }

    const currentPlayer = player.getSerialisedData();

    const objects = this.field
      .getObjectsForUpdate(player)
      .reduce((acc, curr) => {
        if (curr !== player) {
          acc.push(curr.getSerialisedData())
        }
        return acc;
      }, []);

    const message = {
      type: ServerMessageType.UPDATE_FIELD,
      data: {
        currentPlayer,
        objects
      }
    }
    this.networkChannel.sendMessageToPlayer(player.id, message);
  }

  private handlePlayerPositionUpdate(id: string, direction: number): void {
    this.players.find(player => player.id === id)?.updateDirection(direction);
  }

  private getTopTenPlayers(): TopPlayer[] {
    return this.players
      .sort((a: Player, b: Player) => b.radius - a.radius)
      .slice(0, 10)
      .map(({ radius, name }: player) => ({ radius, name }));
  }
}
