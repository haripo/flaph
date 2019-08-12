import { BoxLocation } from '../types';

export function extend(location: BoxLocation, amount: number) {
  return {
    x: location.x - amount,
    y: location.y - amount,
    width: location.width + amount * 2,
    height: location.height + amount * 2
  }
}