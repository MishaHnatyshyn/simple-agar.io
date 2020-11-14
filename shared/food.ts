import {Color} from './colors.enum';
import GameObject from './gameObject';

export default class Food extends GameObject {
  constructor() {
    super();
    this._color = Color.blue;
    this._position = { x: 0, y: 0 };
    this._radius = 10;
  }
}
