import { AABB } from "@/domain/AABB";
import { Vector3 } from "@/domain/Vector";
import type p5 from "p5";

export type Volume = { draw: () => void };
class DrawableAABB extends AABB implements Volume {
  constructor(
    private readonly p: p5,
    vertices: Vector3[],
  ) {
    super(vertices);
  }

  public draw() {
    this.p.push();
    this.p.fill(0, 0, 0, 0);
    this.p.rect(
      this.min.x,
      this.min.y,
      this.max.x - this.min.x,
      this.max.y - this.min.y,
    );
    this.p.pop();
  }
}
class DrawableCircleCollision implements Volume {
  private center: Vector3;
  private radius: number;

  constructor(
    private readonly p: p5,
    vertices: Vector3[],
    k?: number,
  ) {
    const radii: [Vector3, number][] = [];

    const { bottom, left, right, top } = {
      left: -p.width / 2,
      right: p.width / 2,
      top: p.height / 2,
      bottom: -p.height / 2,
    };
    for (let index = 0; index < (k ?? 10); index++) {
      const center = new Vector3([
        Math.random() * (right - left) + left,
        Math.random() * (top - bottom) + bottom,
        0,
      ]);

      let maxDistance = Number.NEGATIVE_INFINITY;

      for (const vertex of vertices) {
        const distance = Math.sqrt(
          (vertex.x - center.x) ** 2 + (vertex.y - center.y) ** 2,
        );

        if (distance > maxDistance) maxDistance = distance;
      }

      radii.push([center, maxDistance]);
    }

    const [center, radius] = radii.reduce(
      (accumulator, currentItem) =>
        currentItem[1] >= accumulator[1] ? accumulator : currentItem,
      radii[0],
    );

    this.center = center;
    this.radius = radius;
  }

  public draw() {
    this.p.push();
    this.p.fill(0, 0, 0, 0);
    this.p.circle(this.center.x, this.center.y, this.radius * 2);
    this.p.pop();
  }
}

export const generateAABB = (p: p5, points: Vector3[]) =>
  new DrawableAABB(p, points);
export const generateCircle = (p: p5, points: Vector3[], k?: number) =>
  new DrawableCircleCollision(p, points, k);
