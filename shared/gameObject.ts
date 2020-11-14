import { Position } from './position.interface'
import {Color} from './colors.enum';

export default class GameObject {
  protected _position: Position;
  protected _color: Color;
  protected _radius: number;

  get position(): Position {
    return this._position;
  }

  get radius(): number {
    return this._radius;
  }

  get color(): Color {
    return this._color;
  }
}
