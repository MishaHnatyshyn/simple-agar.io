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

  updateObjectZone(object: GameObject, prevCoords: Position, nextCoords: Position): void {
    const prevZone = this.getZoneByPosition(prevCoords.x, prevCoords.y);
    const nextZone = this.getZoneByPosition(nextCoords.x, nextCoords.y);
    if (prevZone !== nextZone) {
      prevZone.removeObject(object);
      nextZone.addObject(object);
    }
  }

  addObject(object: GameObject): void {
    const zone = this.getZoneByPosition(object.position.x, object.position.y);
    zone.addObject(object);
  }

  removeObject(object: GameObject): void {
    const zone = this.getZoneByPosition(object.position.x, object.position.y);
    zone.removeObject(object);
  }

  private getZoneByPosition(x: number, y: number): FieldZone {
    return this.zones.flat(1).find((zone: FieldZone) => {
      const isXCordInsideZone = x >= zone.leftTopCornerPosition.x && x <= zone.rightBottomPosition.x
      const isYCordInsideZone = y >= zone.leftTopCornerPosition.y && y <= zone.rightBottomPosition.y
      return isXCordInsideZone && isYCordInsideZone;
    })
  }

  getAllObjects(): Object[] {
    return this.zones.flat(1).map(zone => zone.objects).flat(1);
  }

  clearField(): void {
    this.zones.flat(1).forEach(zone => zone.clearField());
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
    public readonly leftTopCornerPosition: Position,
    public readonly rightBottomPosition: Position,
  ) {
    super();
  }

  addObject(object: GameObject) {
    this.objects.push(object);
  }

  removeObject(object: GameObject): void {
    this.objects = this.objects.filter(object => object.id !== object.id);
  }
}

