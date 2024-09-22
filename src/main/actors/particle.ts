import { AABB } from "@/domain/AABB";
import { getLimits, type Segment3 } from "@/domain/Segment";
import { Vector3 } from "@/domain/Vector";
import type p5 from "p5";
import { drawArrow } from "../drawSegment";

type Entity = Segment3 | Particle;

export class Particle {
  private aabb: AABB;

  constructor(
    private readonly p: p5,
    private radius: number,
    private center: Vector3,
    private velocity: Vector3,
  ) {
    this.aabb = new AABB([
      new Vector3([center.x - radius, center.y - radius, 0]),
      new Vector3([center.x + radius, center.y - radius, 0]),
      new Vector3([center.x - radius, center.y + radius, 0]),
      new Vector3([center.x + radius, center.y + radius, 0]),
    ]);
  }

  public handleCollision(entities: Entity[], callback?: () => void) {
    for (const entity of entities) {
      if (Array.isArray(entity)) {
        const thatAabb = new AABB(entity);
        if (this.aabb.collidesWith(thatAabb)) {
          if (callback) callback();

          if (this.aabb.wasAbove(thatAabb)) this.aabb.correctWasAbove(thatAabb);
          if (this.aabb.wasBelow(thatAabb)) this.aabb.correctWasBelow(thatAabb);
          if (this.aabb.wasLeftOf(thatAabb))
            this.aabb.correctWasLeftOf(thatAabb);
          if (this.aabb.wasRightOf(thatAabb))
            this.aabb.correctWasRightOf(thatAabb);

          this.velocity = this.velocity.reflect(entity);
        }
      }
    }
  }

  public updateMovementState(entities: Entity[], callback?: () => void) {
    this.aabb.translate(new Vector3([this.velocity.x, this.velocity.y, 0]));

    this.handleCollision(entities, callback);

    this.center = new Vector3([this.aabb.center.x, this.aabb.center.y, 0]);
  }

  public draw() {
    const velocityArrow = this.velocity
      .toUnitVector()
      .scale(this.radius * 3)
      .translate(this.center);

    this.p.push();
    this.p.circle(this.center.x, this.center.y, this.radius * 2);
    drawArrow(
      this.p,
      this.center,
      new Vector3([velocityArrow.x, velocityArrow.y, 0], [0, 0, 0]),
      true,
    );
    this.p.fill(0, 0, 0, 0);
    this.p.rectMode("center");
    this.p.rect(this.center.x, this.center.y, this.radius * 2, this.radius * 2);
    this.p.pop();
  }
}
