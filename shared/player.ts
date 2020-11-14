import {Color} from './colors.enum';
import GameObject from './gameObject';

export default class Player extends GameObject {
  constructor(
    public readonly name: string,
    public readonly id: string,
    radius: number,
    color: Color,
  ) {
    super();
    this._position = { x: 0, y: 0};
    this._radius = radius;
    this._color = color;
  }

  public updatePosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  public updateRadius(radius: number): void {
    this._radius = radius;
  }
}
