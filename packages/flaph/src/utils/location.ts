import { BoxLocation } from '../types';

export function extend(location: BoxLocation, amount: number) {
  return {
    x: location.x - amount,
    y: location.y - amount,
    width: location.width + amount * 2,
    height: location.height + amount * 2
  };
}

interface Position {
  x: number;
  y: number;
}

export function add(a: Position, b: Position) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}

export function subtract(a: Position, b: Position) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}
