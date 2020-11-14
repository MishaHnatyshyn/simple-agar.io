import {v4 as uuid} from 'uuid';
import {PositionInterface} from './position.interface';
import {Color} from './colors.enum';

export default class Player {
  private position: PositionInterface;
  private radius: number;
  private id: string
  private color: Color;

  constructor(
    private name: string,
  ) {
    this.position = { x: 0, y: 0};
    this.radius = 15;
    this.id = uuid();
    this.color = Color.blue;
  }

  public updatePosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  public updateSize(size): void {
    this.radius = size;
  }
}
