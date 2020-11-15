import GameObject from './gameObject';
import {getRandomColor, getRandomIntInRange} from '../server/utils';
import {v4 as uuid} from 'uuid';

export default class Food extends GameObject {
  constructor() {
    super();
    this._color = getRandomColor();
    this._position = { x: getRandomIntInRange(0, FIELD_WIDTH), y: getRandomIntInRange(0, FIELD_HEIGHT) };
    this._radius = getRandomIntInRange(5, 20);
    this._id = uuid();
  }
}
