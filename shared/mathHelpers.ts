import {Position} from './position';

export const calculateDistance = (firstPoint: Position, secondPoint: Position): number => {
  const xDiff = firstPoint.x - secondPoint.x;
  const yDiff = firstPoint.y - secondPoint.y;
  return Math.sqrt((xDiff ** 2) + (yDiff ** 2))
}

export const calculateCircleSquare = (radius: number) => {
  return Math.PI * radius ** 2;
}

export const calculateRadiusAfterCirclesMerge = (firstSquare: number, secondSquare: number): number => {
  return Math.sqrt((firstSquare + secondSquare) / Math.PI);
}
