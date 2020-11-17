import GameObject from '../shared/gameObject';
import Food from '../shared/food';
import {FIELD_HEIGHT, FIELD_WIDTH} from '../shared/constants';
import { Position } from '../shared/position.interface';
import Player from '../shared/player';
import FieldZone from "./fieldZone";

export class Field {
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
          x: (FIELD_WIDTH / zonesHorizontalCount * (x + 1)),
          y: (FIELD_HEIGHT / zonesVerticalCount * (y + 1)),
        }
        return new FieldZone(leftTopCorner, rightBottomCorner);
      })
    })
  }

  public getFoodCount(): number {
    return this.zones
      .flat(1)
      .map(zone => zone.objects.filter(object => object instanceof Food))
      .flat()
      .length
  }

  public updateObjectZone(object: GameObject, prevCoords: Position, nextCoords: Position): void {
    const prevZone = this.getZoneByPosition(prevCoords.x, prevCoords.y);
    const nextZone = this.getZoneByPosition(nextCoords.x, nextCoords.y);
    if (prevZone !== nextZone) {
      prevZone.removeObject(object);
      nextZone.addObject(object);
    }
  }

  public addObject(object: GameObject): void {
    const zone = this.getZoneByPosition(object.position.x, object.position.y);
    zone?.addObject(object);
  }

  public removeObject(object: GameObject): void {
    const zone = this.getObjectZone(object);
    zone.removeObject(object);
  }

  public getAllObjects(): Object[] {
    return this.zones.flat(1).map(zone => zone.objects).flat(1);
  }

  public clearField(): void {
    this.zones.flat(1).forEach(zone => zone.clearObjects());
  }

  public getAllFood(): Food[] {
    return this.zones
      .flat(1)
      .map(zone => zone.objects.filter((object: GameObject) => object instanceof Food))
      .flat(1);
  }

  public getNeighbourPlayers(object: GameObject): Player[] {
    const zone = this.getZoneByPosition(object.position.x, object.position.y);
    return zone.getAllPlayers().filter(player => player !== object);
  }

  public getNeighbourFood(object: GameObject): Food[] {
    const zone = this.getZoneByPosition(object.position.x, object.position.y);
    return zone.getAllFood();
  }

  private getObjectZonePosition(object: GameObject): Position {
    for (let x = 0; x < this.zones.length; x++) {
      for (let y = 0; y < this.zones[x].length; y++) {
        if (this.zones[x][y].objects.includes(object)) {
          return { x, y }
        }
      }
    }
  }

  public getObjectsForUpdate(object: GameObject): GameObject[] {
    const position = this.getObjectZonePosition(object);
    if (!position) return [];

    const { x, y } = position;
    const zones = [];

    for (let targetX = x - 2; targetX <= x + 2; targetX++) {
      for (let targetY = y - 2; targetY <= y + 2; targetY++) {
        if (
          targetX >= 0 && targetX < this.zones.length
          && targetY >=0 && targetY < this.zones[0].length
        ) {
          zones.push(this.zones[targetX][targetY])
        }
      }
    }

    return zones
      .map((zone: FieldZone) => zone.getAllObjects())
      .flat(1)
  }

  private getZoneByPosition(x: number, y: number): FieldZone {
    return this.zones.flat(1).find((zone: FieldZone) => {
      const isXCordInsideZone = x >= zone.leftTopCornerPosition.x && x <= zone.rightBottomPosition.x
      const isYCordInsideZone = y >= zone.leftTopCornerPosition.y && y <= zone.rightBottomPosition.y
      return isXCordInsideZone && isYCordInsideZone;
    })
  }

  private getObjectZone(object: GameObject) {
    return this.zones.flat().find((zone) => zone.objects.includes(object));
  }
}

export default Field;
