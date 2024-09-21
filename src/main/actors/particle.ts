import { getLimits, type Segment3 } from "@/domain/Segment";
import type { Vector3 } from "@/domain/Vector";
import type p5 from "p5";

type Entity = Segment3 | Particle;

export class Particle {
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
    private entities: Entity[],
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

  private AABBCollision(thata: Entity) {
    const that: { left: number; right: number; top: number; bottom: number } =
      thata instanceof Particle ? thata : getLimits(thata);

    if (
      this.right < that.left ||
      this.top < that.bottom ||
      this.left > that.right ||
      this.bottom > that.top
    )
      return false;
    return true;
  }

  public handleCollision() {
    for (const entity of this.entities) {
      console.log("alá", entity);
      if (Array.isArray(entity)) {
        if (this.AABBCollision(entity)) {
          this.velocity.reflect(entity);

          return;
        }
      }
    }
  }

  public updateMovementState() {
    this.lastPosition = {
      bottom: this.bottom,
      left: this.left,
      right: this.right,
      top: this.top,
    };

    this.hitbox.x += this.velocity.x;
    this.hitbox.y += this.velocity.y;

    this.handleCollision();

    this.position = this.hitbox;
  }

  public draw() {
    this.p.push();
    this.p.rect(this.position.x, this.position.y, this.radius, this.radius);
    this.p.pop();
  }
}
