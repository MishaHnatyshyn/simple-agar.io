import {Position} from "../shared/position.interface";
import GameObject from "../shared/gameObject";
import Player from "../shared/player";
import Food from "../shared/food";

export default class FieldZone {
    public objects: GameObject[] = [];
    constructor(
        public readonly leftTopCornerPosition: Position,
        public readonly rightBottomPosition: Position,
    ) {}

    public addObject(object: GameObject) {
        this.objects.push(object);
    }

    public removeObject(objectToDelete: GameObject): void {
        this.objects = this.objects.filter(object => objectToDelete.id !== object.id);
    }

    public getAllPlayers(): Player[] {
        return this.objects.filter((object: GameObject) => object instanceof Player) as Player[]
    }

    public getSeparatedObjects(): { food: Food[], players: Player[] } {
        return this.objects.reduce((acc, curr) => {
            if (curr instanceof Player) {
                acc.players.push(curr)
            } else {
                acc.food.push(curr)
            }
            return acc;
        }, { food: [], players: []})
    }

    public getAllFood(): Food[] {
        return this.objects.filter((object: GameObject) => object instanceof Food) as Food[]
    }

    public getAllObjects(): GameObject[] {
        return this.objects;
    }

    public clearObjects(): void {
        this.objects = [];
    }
}
