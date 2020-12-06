import Field from "./field";
import Player from "../shared/player";
import {calculateCircleSquare, calculateDistance, calculateRadiusAfterCirclesMerge} from "../shared/mathHelpers";
import Food from "../shared/food";
import GameObject from "../shared/gameObject";
import {FIELD_HEIGHT, FIELD_WIDTH} from "../shared/constants";

class ObjectInteractionManager {

    constructor(
       private field: Field
    ) {}

    public handlePlayerInteraction(player: Player): void {
        if (player.isDead) {
            return;
        }
        this.updatePlayerPosition(player);
        const neighbourFood = this.field.getNeighbourFood(player);
        const playerSquare = calculateCircleSquare(player.radius);
        neighbourFood.forEach((food) => this.handlePlayerInteractionWithFood(player, food, playerSquare))

        const neighbourPlayers = this.field.getNeighbourPlayers(player)
        neighbourPlayers.forEach((enemy) => this.handleInteractionsWithOtherPlayers(player, enemy, playerSquare));
    }

    private handlePlayerInteractionWithFood(player: Player, food: Food, playerSquare: number): void {
        const shouldEatFood = this.getShouldMerge(player, food);
        if (shouldEatFood) {
            const foodSquare = calculateCircleSquare(food.radius);
            const resultRadius = calculateRadiusAfterCirclesMerge(foodSquare, playerSquare)
            this.performObjectsMerge(player, food, resultRadius);
        }
    }

    private handleInteractionsWithOtherPlayers(player: Player, enemy: Player, playerSquare: number): void {
        if (enemy.isDead || player.isDead) {
            return;
        }
        const shouldMergePlayers = this.getShouldMerge(player, enemy)
        if (shouldMergePlayers) {
            const enemySquare = calculateCircleSquare(enemy.radius)
            const resultRadius = calculateRadiusAfterCirclesMerge(enemySquare, playerSquare)
            const [winner, looser] = player.radius > enemy.radius ? [player, enemy] : [enemy, player];
            this.performObjectsMerge(winner, looser, resultRadius);
        }
    }

    private performObjectsMerge(winner: GameObject, looser: GameObject, resultRadius: number): void {
        if (winner instanceof Player) {
            winner.updateRadius(resultRadius);
            this.handlePlayerOutOfTheFieldCase(winner);
        }

        this.field.removeObject(looser)

        if (looser instanceof Player) {
            looser.kill();
        }
    }

    private handlePlayerOutOfTheFieldCase(player: Player): void {
        if (player.position.x + player.radius > FIELD_WIDTH) {
            player.position.x = FIELD_WIDTH - player.radius;
        } else if(player.position.x - player.radius < 0) {
            player.position.x = player.radius;
        }

        if (player.position.y + player.radius > FIELD_HEIGHT) {
            player.position.y = FIELD_HEIGHT - player.radius;
        } else if(player.position.y - player.radius < 0) {
            player.position.y = player.radius;
        }
    }

    private getShouldMerge(firstObject: GameObject, secondObject: GameObject): boolean {
        const distance = calculateDistance(firstObject.position, secondObject.position);
        const radiusSum = firstObject.radius + secondObject.radius;
        return distance < radiusSum - 0.3 * secondObject.radius
    }

    private updatePlayerPosition(player: Player): void {
        const prevPosition = {...player.position};
        player.updatePosition()
        const nextPosition = player.position;
        if (prevPosition.x !== nextPosition.x || prevPosition.y !== nextPosition.y) {
            this.field.updateObjectZone(player, prevPosition, nextPosition);
        }
    }
}

export default ObjectInteractionManager;