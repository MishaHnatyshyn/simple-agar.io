import Player from '../shared/player';
import Field from './field';
import {INetworkChannel} from './networkChannel.interface';
import {ClientMessage, ClientMessageType, ServerMessageType} from '../shared/message.interface';
import Timer = NodeJS.Timer;
import player from '../shared/player';
import {getRandomColor} from './utils';
import Timeout = NodeJS.Timeout;
import Food from '../shared/food';
import FoodGenerator from './foodGenerator';

export default class Game {
  private DEFAULT_PLAYER_RADIUS: number = 15;
  private MAX_FOOD_COUNT: number = 500;
  private timer: Timer = null;
  private foodGenerationInterval: Timeout = null
  constructor(
    private field: Field,
    private networkChannel: INetworkChannel,
    private foodGenerator: FoodGenerator,
  ) {}

  start(): void {
    this.networkChannel.attachMessageHandler(this.handleNewPlayerMessage.bind(this))
    this.networkChannel.attachDisconnectHandler(this.handlePlayerExit.bind(this))
    this.startRound();
  }

  notifyPlayersAboutNewFood(food: Food): void {
    const message = {
      type: ServerMessageType.NEW_FOOD,
      data: food,
    }

    this.networkChannel.sendMessageToAllPlayers(message);
  }

  finishRound(): void {
    this.field.clearField();
    const topPlayers = this.getTopTenPlayers();
    const message = {
      type: ServerMessageType.FINISH_ROUND,
      data: {
        topPlayers
      }
    }
    this.networkChannel.sendMessageToAllPlayers(message);
    setTimeout(this.startRound.bind(this), 100);
  }

  startRound(): void {
    this.foodGenerator.generateInitialFood();
    const message = {
      type: ServerMessageType.START_NEW_ROUND,
      data: this.field.getAllObjects(),
    }
    this.networkChannel.sendMessageToAllPlayers(message);
    this.foodGenerator.startGeneratingFood(this.notifyPlayersAboutNewFood.bind(this));

    this.timer = setTimeout(this.finishRound.bind(this), 1000 * 60 * 2)
  }

  private handleNewPlayerMessage(message: ClientMessage, id: string): void {
    switch (message.type) {
      case ClientMessageType.START_GAME:
        this.handleNewPlayer(message.data.name, id);
        break;
      case ClientMessageType.CHANGE_POSITION:
        const { x, y } = message.data;
        this.handlePlayerPositionUpdate(id, x, y);
        break;
    }
  }

  private handlePlayerExit(id: string): void {
    this.field.removeObject(id);
  }

  private handleNewPlayer(name: string, id: string): void {
    const color = getRandomColor();
    const player = new Player(name, id, this.DEFAULT_PLAYER_RADIUS, color);
    this.field.addObject(player);
  }

  private handlePlayerPositionUpdate(id: string, x: number, y: number): void {
    this.field.updateObjectPosition(id, x, y);
    const players = this.field.getAllObjects();

    const message = {
      type: ServerMessageType.UPDATE_ENEMIES_POSITIONS,
      data: {
        ...players
      }
    }

    this.networkChannel.sendMessageToAllPlayers(message);
  }

  private getTopTenPlayers(): { name: string, radius: number }[] {
    return this.field.getAllObjects()
      .filter((object) => object instanceof Player)
      .sort((a: Player, b: Player) => b.radius - a.radius)
      .slice(0, 10)
      .map(({ radius, name }: player) => ({ radius, name }));
  }
}
