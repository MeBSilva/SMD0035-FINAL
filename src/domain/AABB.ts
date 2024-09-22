import { Vector3 } from "./Vector";

export class AABB {
  private min: Vector3;
  private lastMin: Vector3;
  private max: Vector3;
  private lastMax: Vector3;

  constructor(vertices: Vector3[]) {
    if (vertices.length < 1) throw new Error("Empty aabb");

    this.min = new Vector3([vertices[0].x, vertices[0].y, vertices[0].z]);
    this.max = new Vector3([vertices[0].x, vertices[0].y, vertices[0].z]);

    for (const vertex of vertices) {
      this.min.x = Math.min(vertex.x, this.min.x);
      this.min.y = Math.min(vertex.y, this.min.y);
      this.min.z = Math.min(vertex.z, this.min.z);

      this.max.x = Math.max(vertex.x, this.max.x);
      this.max.y = Math.max(vertex.y, this.max.y);
      this.max.z = Math.max(vertex.z, this.max.z);
    }

    this.lastMin = new Vector3([this.min.x, this.min.y, this.min.z]);
    this.lastMax = new Vector3([this.max.x, this.max.y, this.max.z]);
  }

  public wasAbove(that: AABB) {
    return this.lastMin.y > that.lastMax.y;
  }
  public wasBelow(that: AABB) {
    return this.lastMax.y < that.lastMin.y;
  }
  public wasLeftOf(that: AABB) {
    return this.lastMax.x <= that.lastMin.x;
  }
  public wasRightOf(that: AABB) {
    return this.lastMin.x >= that.lastMax.x;
  }

  public correctWasAbove(aabb: AABB) {
    const delta = aabb.max.y - this.min.y;
    this.min.y += delta;
    this.max.y += delta;
  }
  public correctWasBelow(aabb: AABB) {
    const delta = aabb.min.y - this.max.y;
    this.min.y += delta;
    this.max.y += delta;
  }
  public correctWasLeftOf(aabb: AABB) {
    const delta = aabb.min.x - this.max.x;
    this.min.x += delta;
    this.max.x += delta;
  }
  public correctWasRightOf(aabb: AABB) {
    const delta = aabb.max.x - this.min.x;
    this.min.x += delta;
    this.max.x += delta;
  }

  get center(): Vector3 {
    return new Vector3([
      (this.min.x + this.max.x) / 2,
      (this.min.y + this.max.y) / 2,
      (this.min.z + this.max.z) / 2,
    ]);
  }

  public translate(delta: Vector3) {
    this.lastMin = new Vector3([this.min.x, this.min.y, this.min.z]);
    this.lastMax = new Vector3([this.max.x, this.max.y, this.max.z]);

    this.min.x += delta.x;
    this.max.x += delta.x;
    this.min.y += delta.y;
    this.max.y += delta.y;
    this.min.z += delta.z;
    this.max.z += delta.z;
  }

  public collidesWith(that: AABB): boolean {
    if (
      this.max.x < that.min.x ||
      this.max.y < that.min.y ||
      this.max.z < that.min.z ||
      this.min.x > that.max.x ||
      this.min.y > that.max.y ||
      this.min.z > that.max.z
    )
      return false;
    return true;
  }
}
