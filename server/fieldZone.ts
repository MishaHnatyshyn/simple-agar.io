import {Position} from "../shared/position.interface";
import GameObject from "../shared/gameObject";
import Player from "../shared/player";
import Food from "../shared/food";
import Field from "./field";

class FieldZone extends Field {
    constructor(
        public readonly leftTopCornerPosition: Position,
        public readonly rightBottomPosition: Position,
    ) {
        super();
    }

    public addObject(object: GameObject) {
        this.objects.push(object);
    }

    public removeObject(objectToDelete: GameObject): void {
        this.objects = this.objects.filter(object => objectToDelete.id !== object.id);
    }

    public getAllPlayers(): Player[] {
        return this.objects.filter((object: GameObject) => object instanceof Player) as Player[]
    }

    public getAllFood(): Food[] {
        return this.objects.filter((object: GameObject) => object instanceof Food) as Food[]
    }
}

export default FieldZone;