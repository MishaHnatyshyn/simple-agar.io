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
import GameObject from '../shared/gameObject';
import food from '../shared/food';

export default class Game {
  private DEFAULT_PLAYER_RADIUS: number = 15;
  private timer: Timer = null;
  private updateInterval: Timeout = null;
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
      data: food.getSerialisedData(),
    }

    this.networkChannel.sendMessageToAllPlayers(message);
  }

  finishRound(): void {
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
    setTimeout(this.startRound.bind(this), 100);
  }

  startRound(): void {
    this.foodGenerator.generateInitialFood();
    const message = {
      type: ServerMessageType.START_NEW_ROUND,
      data: this.field.getAllObjects(),
    }
    this.networkChannel.sendMessageToAllPlayers(message);
    this.updateInterval = setInterval(this.sendFieldUpdateToPlayers.bind(this), 1000 / 60);
    this.foodGenerator.startGeneratingFood(this.notifyPlayersAboutNewFood.bind(this));

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
    this.field.removeObject(id);
  }

  private handleNewPlayer(name: string, id: string): void {
    const color = getRandomColor();
    const player = new Player(name, id, this.DEFAULT_PLAYER_RADIUS, color);
    this.field.addObject(player);
  }

  private sendFieldUpdateToPlayers(): void {
    const players = this.field.getAllPlayers();
    players.forEach(player => player.updatePosition());
    const food = this.field.getAllFood()
    players.forEach((player) => {
      const currentPlayer = player.getSerialisedData();
      const enemies = players.filter((enemy) => enemy.id !== player.id).map(enemy => enemy.getSerialisedData())
      const foodData = food.map(foodItem => foodItem.getSerialisedData())
      const message = {
        type: ServerMessageType.UPDATE_FIELD,
        data: {
          currentPlayer,
          enemies,
          food: foodData
        }
      }
      this.networkChannel.sendMessageToPlayer(player.id, message);
    })
  }

  private handlePlayerPositionUpdate(id: string, direction: number): void {
    this.field.getAllPlayers().find(player => player.id === id).updateDirection(direction);
  }

  private getTopTenPlayers(): { name: string, radius: number }[] {
    return this.field.getAllObjects()
      .filter((object) => object instanceof Player)
      .sort((a: Player, b: Player) => b.radius - a.radius)
      .slice(0, 10)
      .map(({ radius, name }: player) => ({ radius, name }));
  }
}
