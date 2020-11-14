import {Color} from './colors.enum';
import GameObject from './gameObject';

export default class Player extends GameObject {
  constructor(
    private name: string,
    public readonly id: string,
  ) {
    super();
    this._position = { x: 0, y: 0};
    this._radius = 15;
    this._color = Color.blue;
  }

  public updatePosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  public updateRadius(radius: number): void {
    this._radius = radius;
  }
}
