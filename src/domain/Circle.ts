import { Vector3 } from "./Vector";
import type p5 from "p5";

export class Circle {
  protected center: Vector3;
  protected radius = -Infinity;
  protected readonly p: p5;

  constructor(p: p5, vertices: Vector3[], k?:number) {
    this.p = p;
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

  public getCenter() {
    return this.center;
  }

  public getRadius() {
    return this.radius;
  }

}
