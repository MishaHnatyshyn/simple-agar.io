import Field from './field';
import Food from '../shared/food';

export default class FoodGenerator {
  constructor(
    private field: Field,
    private maxFoodCount: number,
    private foodGenerationInterval,
  ) {}

  generateFood(callback: (food: Food) => void): void {
    if (this.field.getFoodCount() >= this.maxFoodCount) {
      return;
    }

    const newFood = new Food();
    this.field.addObject(newFood);
    callback(newFood);
  }

  generateInitialFood(): void {
    [...new Array(100)].forEach(() => {
      this.field.addObject(new Food());
    })
  }

  startGeneratingFood(callback: (food: Food) => void): void {
    this.foodGenerationInterval = setInterval(this.generateFood.bind(this, callback), 1000);
  }

  stopGeneratingFood(): void {
    clearInterval(this.foodGenerationInterval);
  }
}
