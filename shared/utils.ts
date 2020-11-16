import {Color, COLORS} from './colors.enum';
import {FIELD_HEIGHT, FIELD_WIDTH} from './constants';
import {Position} from './position';

export const getRandomIntInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export const getRandomColor = (): Color => COLORS[getRandomIntInRange(0, COLORS.length - 1)];

export const getRandomPosition = (): Position => ({
  x: getRandomIntInRange(20, FIELD_WIDTH - 20),
  y: getRandomIntInRange(20, FIELD_HEIGHT - 20)
})

// export const arrayBufferToString = (buff: ArrayBuffer) => String.fromCharCode(...new Uint8Array(buff))
//
// export const stringToArrayBuffer = (data: string) => {
//   const buf = new ArrayBuffer(data.length);
//   const bufView = new Uint8Array(buf);
//   for (let i = 0, strLen = data.length; i < strLen; i++) {
//     bufView[i] = data.charCodeAt(i);
//   }
//   return buf;
// }
