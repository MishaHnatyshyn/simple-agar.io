import {Color} from './colors.enum';
import GameObject from './gameObject';
import {FIELD_HEIGHT, FIELD_WIDTH} from './constants';

export default class Player extends GameObject {
  private speed: number = 400;
  constructor(
    public readonly name: string,
    id: string,
    radius: number,
    color: Color,
    private _direction: number = 0,
  ) {
    super();
    this._position = { x: 0, y: 0};
    this._radius = radius;
    this._color = color;
    this._id = id;
  }

  public updatePosition(): void {
    const newX = 100 * this.speed * Math.sin(this._direction);
    const newY = 100 * this.speed * Math.cos(this._direction);
    if (newX >= 0 && newX <= FIELD_HEIGHT) {
      this.position.x = newX;
    }
    if (newY >= 0 && newY <= FIELD_WIDTH) {
      this.position.y = newY;
    }
  }

  public updateRadius(radius: number): void {
    this._radius = radius;
  }

  public updateDirection(direction: number): void {
    this._direction = direction;
  }

  getSerialisedData() {
    const baseData = super.getSerialisedData();
    return {
      ...baseData,
      name: this.name,
      direction: this._direction
    }
  }
}
