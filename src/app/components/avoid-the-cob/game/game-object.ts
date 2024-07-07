import { GameObjectShape } from './game-object-shape';
import { GameObjectBehaviour } from './game-object-behaviour';
import { Canvas } from './canvas';

export class GameObject {
  public x!: number;
  public y!: number;
  public deltaX = 0;
  public deltaY = 0;
  public size!: number;
  public colour!: string;
  public behaviour!: GameObjectBehaviour;
  public shape!: GameObjectShape;
  public destroyed = false;

  public detectWallCollisionX(canvasW: number): boolean {
    return this.x + this.size / 2 > canvasW || this.x - this.size / 2 < 0;
  }

  public detectWallCollisionY(canvasH: number): boolean {
    return this.y + this.size / 2 > canvasH || this.y - this.size / 2 < 0;
  }

  public reverseDirection(x: boolean): void {
    x ? (this.deltaX = this.deltaX * -1) : (this.deltaY = this.deltaY * -1);
  }

  public detectCollision(object: GameObject): boolean {
    if (this.shape === GameObjectShape.Rect) {
      // Arc to Rect Collision
      const distanceX = Math.abs(object.x - this.x);
      const distanceY = Math.abs(object.y - this.y);
      const halfSize = this.size / 2;

      // Check each side
      if (distanceX > halfSize + object.size) {
        return false;
      } else if (distanceY > halfSize + object.size) {
        return false;
      } else if (distanceX <= halfSize) {
        return true;
      } else if (distanceY <= halfSize) {
        return true;
      } else {
        // Check corners
        const dx = distanceX - halfSize;
        const dy = distanceY - halfSize;
        return dx * dx + dy * dy <= object.size * object.size;
      }
    } else {
      // Arc to Arc Collision
      const dx = object.x - this.x;
      const dy = object.y - this.y;
      const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      return distance <= object.size + this.size + 0.1;
    }
  }

  public move(): void {
    // Move object by delta
    this.moveX();
    this.moveY();
  }

  public moveX(): void {
    this.x = this.x + this.deltaX;
  }

  public moveY(): void {
    this.y = this.y + this.deltaY;
  }

  public setRandomDelta(x: boolean, y: boolean, speedMultiplier: number): void {
    if (x) {
      this.deltaX = (Math.random() - Math.random()) * speedMultiplier;
    }

    if (y) {
      this.deltaY = (Math.random() - Math.random()) * speedMultiplier;
    }
  }

  public applyForce(x: boolean, force: number): void {
    x ? (this.x = this.x + force) : (this.y = this.y + force);
  }

  public follow(
    object: GameObject,
    radiusMultiplier: number,
    canvas: Canvas,
    speed: number,
    repel = false,
  ): void {
    const obj = Object.assign({}, object);
    obj.size = obj.size * radiusMultiplier;

    if (this.detectCollision(obj)) {
      // Vector from object to follow coordinate
      let dx = object.x - this.x;
      let dy = object.y - this.y;

      // Unit vector in the same direction
      const distance = Math.sqrt(dx * dx + dy * dy);
      dx /= distance;
      dy /= distance;

      // Speed-pixel vector in the same direction
      dx *= speed;
      dy *= speed;

      // Apply Force
      if (!this.detectWallCollisionX(canvas.w)) {
        !repel ? this.applyForce(true, dx) : this.applyForce(true, -dx);
      }
      if (!this.detectWallCollisionY(canvas.h)) {
        !repel ? this.applyForce(false, dy) : this.applyForce(false, -dy);
      }
    }
  }

  public behaviourEquals(behaviour: GameObjectBehaviour): boolean {
    return this.behaviour === behaviour;
  }

  public toggleBehaviour(behaviour: GameObjectBehaviour): void {
    this.behaviour = !this.behaviourEquals(behaviour)
      ? behaviour
      : GameObjectBehaviour.Default;
  }
}
