import { AABB } from "@/domain/AABB";
import { OBB } from "@/domain/OBB";
import { Vector3 } from "@/domain/Vector";
import { Circle } from "@/domain/Circle";
import type p5 from "p5";
import { Particle } from "../actors/particle";
import { Matrix3 } from "@/domain/Matrix";

export type Volume = {
  draw: () => void;
  isSelected: boolean;
  changeState: () => void;
  contains: (vertex: Vector3) => boolean;
  intersects: (volume: Volume) => boolean;
};
export class DrawableAABB extends AABB implements Volume {
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

  public intersects(that: Volume): boolean {
    if (that instanceof Particle) return this.contains(that.center);
    if (that instanceof DrawableAABB) return this.collidesWith(that);
    if (that instanceof DrawableCircleCollision) {
      let d2 = 0;

      if (that.center.x > this.max.x) d2 += (this.max.x - that.center.x) ** 2;
      else if (that.center.x < this.min.x)
        d2 += (this.min.x - that.center.x) ** 2;

      if (that.center.y > this.max.y) d2 += (this.max.y - that.center.y) ** 2;
      else if (that.center.y < this.min.y)
        d2 += (this.min.y - that.center.y) ** 2;

      if (that.r2 >= d2) return true;

      return false;
    }
    if (that instanceof DrawableOBB) return that.intersects(this);

    return false;
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
export class DrawableCircleCollision implements Volume {
  public center: Vector3;
  public radius: number;
  public r2: number;
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
    this.r2 = radius ** 2;
  }

  public changeState() {
    this.isSelected = !this.isSelected;
  }

  public contains(vertex: Vector3) {
    return this.center.minus(vertex).norm() <= this.radius;
  }

  public intersects(that: Volume) {
    if (that instanceof Particle) return this.contains(that.center);
    if (that instanceof DrawableCircleCollision)
      return this.center.minus(that.center).norm() <= this.radius + that.radius;
    if (that instanceof DrawableAABB) return that.intersects(this);
    if (that instanceof DrawableOBB) return that.intersects(this);

    return false;
  }

  public draw() {
    this.p.push();
    this.p.fill(0, 0, 0, 0);
    if (this.isSelected) this.p.fill(255, 0, 0, 100);
    this.p.circle(this.center.x, this.center.y, this.radius * 2);
    this.p.pop();
  }
}
export class DrawableOBB extends OBB implements Volume {
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

  public intersects(that: Volume) {
    if (that instanceof Particle) return this.contains(that.center);
    if (that instanceof DrawableCircleCollision) {
      const centerAtOrigin = that.center.minus(this.center);

      const rotationMatrix = new Matrix3([
        [this.u.x, this.v.x],
        [this.u.y, this.v.y],
      ]);

      const rotatedCircle = new DrawableCircleCollision(this.p, []);
      rotatedCircle.radius = that.radius;
      rotatedCircle.r2 = that.r2;
      rotatedCircle.center = rotationMatrix.dot(centerAtOrigin);

      const maxU = this.u.times(this.e.x);
      const minU = new Vector3().minus(this.u.times(this.e.x));
      const maxV = this.v.times(this.e.y);
      const minV = new Vector3().minus(this.v.times(this.e.y));

      const p1 = rotationMatrix.dot(maxU.plus(maxV));
      const p2 = rotationMatrix.dot(maxU.plus(minV));
      const p3 = rotationMatrix.dot(minU.plus(minV));
      const p4 = rotationMatrix.dot(minU.plus(maxV));

      const aabb = new DrawableAABB(this.p, [p1, p2, p3, p4]);
      return aabb.intersects(rotatedCircle);
    }

    if (that instanceof DrawableAABB) {
      const maxU = this.u.times(this.e.x);
      const minU = new Vector3().minus(this.u.times(this.e.x));
      const maxV = this.v.times(this.e.y);
      const minV = new Vector3().minus(this.v.times(this.e.y));

      const p1 = maxU.plus(maxV).plus(this.center);
      const p2 = maxU.plus(minV).plus(this.center);
      const p3 = minU.plus(minV).plus(this.center);
      const p4 = minU.plus(maxV).plus(this.center);

      const projectionsOnX = [
        p1.projection(new Vector3([1, 0, 0])),
        p2.projection(new Vector3([1, 0, 0])),
        p3.projection(new Vector3([1, 0, 0])),
        p4.projection(new Vector3([1, 0, 0])),
      ];

      const [minProjectionOnX, maxProjectionOnX] = projectionsOnX.reduce(
        (accumulator, currentItem) => {
          if (currentItem.x < accumulator[0].x) accumulator[0] = currentItem;
          if (currentItem.x > accumulator[1].x) accumulator[1] = currentItem;
          return accumulator;
        },
        [projectionsOnX[0], projectionsOnX[1]] as [Vector3, Vector3],
      );
      if (
        (maxProjectionOnX.x <= that.max.x &&
          maxProjectionOnX.x >= that.min.x) ||
        (minProjectionOnX.x <= that.max.x && minProjectionOnX.x >= that.min.x)
      )
        return true;

      const projectionsOnY = [
        p1.projection(new Vector3([0, 1, 0])),
        p2.projection(new Vector3([0, 1, 0])),
        p3.projection(new Vector3([0, 1, 0])),
        p4.projection(new Vector3([0, 1, 0])),
      ];

      const [minProjectionOnY, maxProjectionOnY] = projectionsOnY.reduce(
        (accumulator, currentItem) => {
          if (currentItem.y < accumulator[0].y) accumulator[0] = currentItem;
          if (currentItem.y > accumulator[1].y) accumulator[1] = currentItem;
          return accumulator;
        },
        [projectionsOnY[0], projectionsOnY[1]] as [Vector3, Vector3],
      );
      if (
        (maxProjectionOnY.y <= that.max.y &&
          maxProjectionOnY.y >= that.min.y) ||
        (minProjectionOnY.y <= that.max.y && minProjectionOnY.y >= that.min.y)
      )
        return true;

      return false;
    }

    return false;
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
