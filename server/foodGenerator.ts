import Field from './field';
import Food from '../shared/food';

export default class FoodGenerator {
  constructor(
    private field: Field,
    private maxFoodCount: number,
    private foodGenerationInterval,
  ) {}

  public generateFood(): void {
    if (this.field.getFoodCount() >= this.maxFoodCount) {
      return;
    }

    const newFood = new Food();
    this.field.addObject(newFood);
  }

  public generateInitialFood(): void {
    [...new Array(40)].forEach(() => {
      this.field.addObject(new Food());
    })
  }

  public startGeneratingFood(): void {
    this.foodGenerationInterval = setInterval(this.generateFood.bind(this), 500);
  }

  public stopGeneratingFood(): void {
    clearInterval(this.foodGenerationInterval);
  }
}
