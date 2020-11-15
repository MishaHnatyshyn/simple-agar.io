import Player from '../shared/player';
import GameObject from '../shared/gameObject';
import Food from '../shared/food';

export default class Field {
  private objects: GameObject[] = [];

  getFoodCount(): number {
    return this.objects.filter(object => object instanceof Food).length
  }

  addObject(object: GameObject): void {
    this.objects.push(object)
  }

  removeObject(id: string): void {
    this.objects = this.objects.filter(object => object.id !== id);
  }

  getAllObjects(): Object[] {
    return this.objects;
  }

  updateObjectPosition(id: string, x: number, y: number): void {
    const object = this.objects.find(object => object.id === id);
    if (object instanceof Player) {
      object.updatePosition(x, y);
    }
  }

  clearField(): void {
    this.objects = [];
  }
}
