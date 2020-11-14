import {v4 as uuid} from 'uuid';
import {Position} from './position';
import {Color} from './colors.enum';

export default class Player {
  private position: Position = { x: 0, y: 0};
  private radius: number = 15;
  private id: string = uuid();
  private color: Color = Color.blue;

  constructor(
    private name: string,
  ) {}

  public updatePosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  public updateRadius(radius: number): void {
    this.radius = radius;
  }
}
