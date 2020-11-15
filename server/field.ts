import Player from '../shared/player';
import GameObject from '../shared/gameObject';
import Food from '../shared/food';
import {FIELD_HEIGHT, FIELD_WIDTH} from '../shared/constants';
import { Position } from '../shared/position.interface';

export default class Field {
  private zones: FieldZone[][];
  constructor(
    private width: number = 0,
    private height: number = 0,
    private zonesHorizontalCount: number = 0,
    private zonesVerticalCount: number = 0,
  ) {
    this.zones = [...new Array(zonesVerticalCount)].map((_, y) => {
      return [...new Array(zonesHorizontalCount)].map((_, x) => {
        const leftTopCorner = {
          x: FIELD_WIDTH / zonesHorizontalCount * x,
          y: FIELD_HEIGHT / zonesVerticalCount * y,
        }
        const rightBottomCorner = {
          x: (FIELD_WIDTH / zonesHorizontalCount * (x + 1)) - 1,
          y: (FIELD_HEIGHT / zonesVerticalCount * (y + 1)) - 1,
        }
        return new FieldZone(leftTopCorner, rightBottomCorner);
      })
    })
  }

  protected objects: GameObject[] = [];

  getFoodCount(): number {
    return this.zones
      .flat(1)
      .map(zone => zone.objects.filter(object => object instanceof Food))
      .flat()
      .length
  }

  addObject(object: GameObject): void {
    this.zones[0][0].addObject(object);
  }

  removeObject(id: string): void {
    this.objects = this.objects.filter(object => object.id !== id);
  }

  private getZoneByPosition(x: number, y: number): FieldZone {
    return this.zones.flat(1).find((zone: FieldZone) => {
      return;
    })
  }

  getAllObjects(): Object[] {
    return this.zones.flat(1).map(zone => zone.objects).flat(1);
  }

  clearField(): void {
    this.zones.flat(1).forEach(zone => zone.clearField());
  }

  getAllPlayers(): Player[] {
    return this.zones
      .flat(1)
      .map(zone => zone.getAllPlayers())
      .flat(1);
  }

  getAllFood(): Food[] {
    return this.zones
      .flat(1)
      .map(zone => zone.objects.filter((object: GameObject) => object instanceof Food))
      .flat(1);
  }
}

class FieldZone extends Field {
  constructor(
    private leftTopCornerPosition: Position,
    private rightBottomPosition: Position,
  ) {
    super();
  }

  getAllPlayers(): Player[] {
    return this.objects.filter((object: GameObject) => object instanceof Player) as Player[]
  }

  addObject(object: GameObject) {
    this.objects.push(object);
  }
}

