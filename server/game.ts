import Player from '../shared/player';
import player from '../shared/player';
import Field from './field';
import {INetworkChannel} from './networkChannel.interface';
import {ClientMessage, ClientMessageType, ServerMessageType} from '../shared/message.interface';
import {getRandomColor} from './utils';
import Food from '../shared/food';
import FoodGenerator from './foodGenerator';
import Timer = NodeJS.Timer;
import Timeout = NodeJS.Timeout;

export default class Game {
  private DEFAULT_PLAYER_RADIUS: number = 15;
  private timer: Timer = null;
  private updateInterval: Timeout = null;
  private players: Player[] = [];
  constructor(
    private field: Field,
    private networkChannel: INetworkChannel,
    private foodGenerator: FoodGenerator,
  ) {}

  public start(): void {
    this.networkChannel.attachMessageHandler(this.handleNewPlayerMessage.bind(this))
    this.networkChannel.attachDisconnectHandler(this.handlePlayerExit.bind(this))
    this.startRound();
  }

  public notifyPlayersAboutNewFood(food: Food): void {
    const message = {
      type: ServerMessageType.NEW_FOOD,
      data: food.getSerialisedData(),
    }

    // this.networkChannel.sendMessageToAllPlayers(message);
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
    setTimeout(this.startRound.bind(this), 100);
  }

  public startRound(): void {
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
    const playerToDelete = this.players.find(player => player.id === id);
    this.players = this.players.filter(player => player !== playerToDelete);
    this.field.removeObject(playerToDelete);
  }

  private handleNewPlayer(name: string, id: string): void {
    const color = getRandomColor();
    const player = new Player(name, id, this.DEFAULT_PLAYER_RADIUS, color);
    this.players.push(player);
    this.field.addObject(player);
  }

  private sendFieldUpdateToPlayers(): void {
    const players = this.players;
    players.forEach(player => {
      if (player.isDead) {
        return;
      }
      const prevPosition = player.position;
      player.updatePosition()
      const nextPosition = player.position;
      if (prevPosition !== nextPosition) {
        this.field.updateObjectZone(player, prevPosition, nextPosition);
      }
      const neighbourFood = this.field.getNeighbourFood(player);
      const playerSquare = Math.PI * player.radius ** 2;
      neighbourFood.forEach((food) => {
        const distance = Math.sqrt(((food.position.x - player.position.x) ** 2) + ((food.position.y - player.position.y) ** 2))
        const radiusSum = food.radius + player.radius;
        if (distance < radiusSum - 0.3 * food.radius) {
          const foodSquare = Math.PI * food.radius ** 2;
          const resultSquare = foodSquare + playerSquare;
          const resultRadius = Math.sqrt(resultSquare / Math.PI);
          player.updateRadius(resultRadius);
          this.field.removeObject(food);
        }
      })

      const neighbourPlayers = this.field.getNeighbourPlayers(player)
      neighbourPlayers.forEach((enemy) => {
        if (enemy.isDead || player.isDead) {
          return;
        }
        const distance = Math.sqrt(((enemy.position.x - player.position.x) ** 2) + ((enemy.position.y - player.position.y) ** 2))
        const radiusSum = enemy.radius + player.radius;
        if (distance < radiusSum - 0.3 * enemy.radius) {
          const enemySquare = Math.PI * enemy.radius ** 2;
          const resultSquare = enemySquare + playerSquare;
          const resultRadius = Math.sqrt(resultSquare / Math.PI);
          if (player.radius > enemy.radius) {
            player.updateRadius(resultRadius);
            this.field.removeObject(enemy);
            enemy.kill();
          } else {
            enemy.updateRadius(resultRadius);
            this.field.removeObject(player);
            player.kill();
          }

        }
      })
    });

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

      if (player.isDead) {
        this.networkChannel.sendMessageToPlayer(player.id, {
          type: ServerMessageType.GAME_OVER,
          data: {}
        })
      }
    })

    this.players = this.players.filter(player => !player.isDead)
  }

  private handlePlayerPositionUpdate(id: string, direction: number): void {
    this.players.find(player => player.id === id).updateDirection(direction);
  }

  private getTopTenPlayers(): { name: string, radius: number }[] {
    return this.players
      .sort((a: Player, b: Player) => b.radius - a.radius)
      .slice(0, 10)
      .map(({ radius, name }: player) => ({ radius, name }));
  }
}
