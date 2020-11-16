import GameObject from './gameObject';
import {getRandomColor, getRandomIntInRange, getRandomPosition} from '../server/utils';
import {v4 as uuid} from 'uuid';

export default class Food extends GameObject {
  constructor() {
    super();
    this._color = getRandomColor();
    this._position = getRandomPosition();
    this._radius = getRandomIntInRange(5, 20);
    this._id = uuid();
  }
}
