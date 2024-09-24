import { Vector3 } from "./Vector";
import { AABB } from "./AABB"

export class OBB {
  protected center: Vector3;
  protected quarter_area = Infinity;
  protected e: Vector3;
  protected maxu: Vector3;
  protected minu: Vector3;
  protected u: Vector3;
  protected v: Vector3;

  constructor(vertices: Vector3[]) {
    if (vertices.length < 1) throw new Error("Empty obb");

    for (let index = 0; index < 90; index++) {
      let theta = index * Math.PI / 180;
      let current_u = new Vector3([Math.cos(theta), Math.sin(theta), 0]);
      let current_v = current_u.rotate90();

      let [min_u, max_u] = this.projetar(vertices, current_u);
      let [min_v, max_v] = this.projetar(vertices, current_v);

      let extents = new Vector3([(max_u - min_u)/2, (max_v - min_v)/2, 0])
      let current_quarter_area = extents.x * extents.y;

      if (current_quarter_area < this.quarter_area) {
        let u_center = current_u.times((max_u + min_u)/2);
        let v_center = current_v.times((max_v + min_v)/2);
        this.center = u_center.plus(v_center);
        this.quarter_area = current_quarter_area;
        this.e = extents;
        this.u = current_u;
        this.v = current_v;
      }
    }
  }

  public projetar(points: Vector3[], eixo: Vector3) {
    let min_p = Infinity;
    let max_p = - Infinity;

    for (const point of points) {
      let proj = point.projection(eixo);
      let coord;
      if (proj.x * eixo.x > 0) {
        coord = proj.norm();
      } else {
        coord = - proj.norm();
      }
      min_p = Math.min(coord, min_p);
      max_p = Math.max(coord, max_p);
    }

    return [min_p, max_p];

  }

}
