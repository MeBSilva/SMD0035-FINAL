import { AABB } from "@/domain/AABB";
import { OBB } from "@/domain/OBB";
import { Vector3 } from "@/domain/Vector";
import type p5 from "p5";

export type Volume = {
  draw: () => void;
  isSelected: boolean;
  changeState: () => void;
  contains: (vertex: Vector3) => boolean;
};
class DrawableAABB extends AABB implements Volume {
  public isSelected = false;

  constructor(
    private readonly p: p5,
    vertices: Vector3[],
  ) {
    super(vertices);
  }

  public changeState() {
    this.isSelected = !this.isSelected;
  }

  public contains(vertex: Vector3) {
    if (
      this.max.x < vertex.x ||
      this.max.y < vertex.y ||
      this.max.z < vertex.z ||
      this.min.x > vertex.x ||
      this.min.y > vertex.y ||
      this.min.z > vertex.z
    )
      return false;
    return true;
  }

  public draw() {
    this.p.push();
    this.p.fill(0, 0, 0, 0);
    if (this.isSelected) this.p.fill(255, 0, 0, 100);
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
  public isSelected = false;

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

  public changeState() {
    this.isSelected = !this.isSelected;
  }

  public contains(vertex: Vector3) {
    return this.center.minus(vertex).norm() <= this.radius;
  }

  public draw() {
    this.p.push();
    this.p.fill(0, 0, 0, 0);
    if (this.isSelected) this.p.fill(255, 0, 0, 100);
    this.p.circle(this.center.x, this.center.y, this.radius * 2);
    this.p.pop();
  }
}
class DrawableOBB extends OBB implements Volume {
  public isSelected = false;

  constructor(
    private readonly p: p5,
    vertices: Vector3[],
  ) {
    super(vertices);
  }

  public changeState() {
    this.isSelected = !this.isSelected;
  }

  public contains(vertex: Vector3) {
    const maxU = this.center.plus(this.u.times(this.e.x));
    const minU = this.center.minus(this.u.times(this.e.x));
    const maxV = this.center.plus(this.v.times(this.e.y));
    const minV = this.center.minus(this.v.times(this.e.y));

    const projectionU = vertex
      .minus(this.center)
      .projection(this.u)
      .plus(this.center);
    const projectionV = vertex
      .minus(this.center)
      .projection(this.v)
      .plus(this.center);

    if (
      maxU.x < projectionU.x ||
      maxV.y < projectionV.y ||
      minU.x > projectionU.x ||
      minV.y > projectionV.y
    )
      return false;
    return true;
  }

  public draw() {
    this.p.push();
    this.p.fill(0, 0, 0, 0);
    if (this.isSelected) this.p.fill(255, 0, 0, 100);
    this.p.circle(this.center.x, this.center.y, 5);
    this.p.quad(
      this.center.plus(this.v.times(this.e.y)).minus(this.u.times(this.e.x)).x,
      this.center.plus(this.v.times(this.e.y)).minus(this.u.times(this.e.x)).y,
      this.center.plus(this.v.times(this.e.y)).plus(this.u.times(this.e.x)).x,
      this.center.plus(this.v.times(this.e.y)).plus(this.u.times(this.e.x)).y,
      this.center.minus(this.v.times(this.e.y)).plus(this.u.times(this.e.x)).x,
      this.center.minus(this.v.times(this.e.y)).plus(this.u.times(this.e.x)).y,
      this.center.minus(this.v.times(this.e.y)).minus(this.u.times(this.e.x)).x,
      this.center.minus(this.v.times(this.e.y)).minus(this.u.times(this.e.x)).y,
    );
    this.p.pop();
  }
}

export const generateOBB = (p: p5, points: Vector3[]) =>
  new DrawableOBB(p, points);
export const generateAABB = (p: p5, points: Vector3[]) =>
  new DrawableAABB(p, points);
export const generateCircle = (p: p5, points: Vector3[], k?: number) =>
  new DrawableCircleCollision(p, points, k);
