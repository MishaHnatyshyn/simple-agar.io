import {Color, COLORS} from '../shared/colors.enum';
import {FIELD_HEIGHT, FIELD_WIDTH} from '../shared/constants';
import {Position} from '../shared/position';

export const getRandomIntInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export const getRandomColor = (): Color => COLORS[getRandomIntInRange(0, COLORS.length - 1)];

export const getRandomPosition = (): Position => ({
  x: getRandomIntInRange(20, FIELD_WIDTH - 20),
  y: getRandomIntInRange(20, FIELD_HEIGHT - 20)
})
