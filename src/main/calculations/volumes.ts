import { AABB } from "@/domain/AABB";
import { OBB } from "@/domain/OBB";
import { Vector3 } from "@/domain/Vector";
import { Circle } from "@/domain/Circle"
import type p5 from "p5";

export type Volume = {
  draw: () => void;
  isSelected: boolean;
  changeState: () => void;
  contains: (vertex: Vector3) => boolean;
  colides: (that: Volume) => boolean;
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

  public colides(that: Volume) {
    if (that instanceof AABB) {
      return !(
        this.max.x < that.getMin().x ||
        this.min.x > that.getMax().x ||
        this.max.y < that.getMin().y ||
        this.min.y > that.getMax().y
      )
    };
    if (that instanceof OBB) {
      return false
    }
    if (that instanceof Circle) {
      if (this.contains(that.getCenter())) return true;
    }
    return false
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
class DrawableCircle extends Circle implements Volume {
  public isSelected = false;

  constructor(
    p: p5,
    vertices: Vector3[],
    k?: number,
  ) {
    super(p, vertices, k)
  }

  public changeState() {
    this.isSelected = !this.isSelected;
  }

  public contains(vertex: Vector3) {
    return this.center.minus(vertex).norm() <= this.radius;
  }

  public colides(that: Volume) {
    return false
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

  public colides(that: Volume) {
    return false
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
  new DrawableCircle(p, points, k);
