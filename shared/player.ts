import {Color} from './colors.enum';
import GameObject from './gameObject';
import {FIELD_HEIGHT, FIELD_WIDTH} from './constants';
import {getRandomPosition} from './utils';

export default class Player extends GameObject {
  private _isDead: boolean = false;
  private speed: number = 0.15;
  constructor(
    public readonly name: string,
    id: string,
    radius: number,
    color: Color,
    private _direction: number = null,
  ) {
    super();
    this._position = getRandomPosition();
    this._radius = radius;
    this._color = color;
    this._id = id;
  }

  public updatePosition(): void {
    if (!this._direction) {
      return;
    }

    const xShift = 100 * this.speed * Math.sin(this._direction);
    const yShift = 100 * this.speed * Math.cos(this._direction);
    const newX = this.position.x + xShift;
    const newY = this.position.y - yShift;

    if (newX >= this._radius && newX <= FIELD_WIDTH - this._radius) {
      this.position.x = newX;
    }
    if (newY >= this._radius && newY <= FIELD_HEIGHT - this._radius) {
      this.position.y = newY;
    }
  }

  public updateRadius(radius: number): void {
    this._radius = radius;
  }

  public updateDirection(direction: number): void {
    this._direction = direction;
  }

  public getSerialisedData() {
    const baseData = super.getSerialisedData();
    return {
      ...baseData,
      name: this.name,
    }
  }

  public kill(): void {
    this._isDead = true;
  }

  get isDead(): boolean {
    return this._isDead;
  }
}
