import GameObject from './gameObject';
import {getRandomColor, getRandomIntInRange} from '../server/utils';
import {v4 as uuid} from 'uuid';
import {FIELD_HEIGHT, FIELD_WIDTH} from './constants';

export default class Food extends GameObject {
  constructor() {
    super();
    this._color = getRandomColor();
    this._position = { x: getRandomIntInRange(0, FIELD_WIDTH - 1), y: getRandomIntInRange(0, FIELD_HEIGHT - 1) };
    this._radius = getRandomIntInRange(5, 20);
    this._id = uuid();
  }
}
