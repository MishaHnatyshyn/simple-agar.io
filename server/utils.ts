import {COLORS} from '../shared/colors.enum';

export const getRandomIntInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export const getRandomColor = () => COLORS[getRandomIntInRange(0, COLORS.length - 1)];
