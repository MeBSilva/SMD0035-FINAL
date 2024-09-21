import type { Vector3 } from "@/domain/Vector";
import type p5 from "p5";

export abstract class Particle {
  private hitbox: Vector3;
  public lastPosition: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };

  constructor(
    private readonly p: p5,
    private radius: number,
    private position: Vector3,
    private velocity: Vector3,
  ) {
    this.hitbox = position;
    this.lastPosition = {
      bottom: this.bottom,
      left: this.left,
      right: this.right,
      top: this.top,
    };
  }

  get left() {
    return this.hitbox.x;
  }
  get right() {
    return this.left + this.radius;
  }
  get top() {
    return this.hitbox.y;
  }
  get bottom() {
    return this.top + this.radius;
  }

  // public handleCollision(entities: Entity[]) {
  //   entities.forEach((entity) => {
  //     if (this.collidesWith(entity)) {
  //       if (entity instanceof Player) {
  //         entity.takeDamage();
  //         return;
  //       }
  //       if (entity instanceof Wall) {
  //         if (this.wasAbove(entity)) {
  //           this.hitbox.y = entity.top - this.height;
  //           this.currentVelocity.vertical = ScreenUnit.Nil();
  //         }
  //         if (this.wasLeftOf(entity) || this.wasRightOf(entity))
  //           this.currentVelocity.horizontal =
  //             this.currentVelocity.horizontal.withNegatedSign();

  //         return;
  //       }
  //       if (entity !== this)
  //         this.currentVelocity.horizontal =
  //           this.currentVelocity.horizontal.withNegatedSign();
  //     }
  //   });
  // }

  public updateMovementState() {
    this.lastPosition = {
      bottom: this.bottom,
      left: this.left,
      right: this.right,
      top: this.top,
    };

    this.hitbox.x += this.velocity.x;
    this.hitbox.y += this.velocity.y;

    // this.handleCollision(this.gameState.entities);

    this.position = this.hitbox;
  }

  public draw() {
    this.p.push();
    this.p.circle(this.position.x, this.position.y, this.radius * 2);
    this.p.pop();
  }
}
