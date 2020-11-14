import {Color, COLORS} from './colors.enum';
import GameObject from './gameObject';
import {getRandomColor} from '../server/utils';

export default class Food extends GameObject {
  constructor() {
    super();
    this._color = getRandomColor();
    this._position = { x: 0, y: 0 };
    this._radius = 10;
  }
}
