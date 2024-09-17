import { Vector3 } from "./Vector";

export const checkForCollision = (
  AB: [Vector3, Vector3],
  CD: [Vector3, Vector3],
): undefined | Vector3 => {
  const A = new Vector3([0, 0, 0]);
  const B = new Vector3([AB[1].x - AB[0].x, AB[1].y - AB[0].y, 0]);
  const C = new Vector3([CD[0].x - AB[0].x, CD[0].y - AB[0].y, 0]);
  const D = new Vector3([CD[1].x - AB[0].x, CD[1].y - AB[0].y, 0]);

  const ABxAC = B.cross(C);
  const ABxAD = B.cross(D);

  if ((ABxAC.z > 0 && ABxAD.z > 0) || (ABxAC.z < 0 && ABxAD.z < 0)) return;

  const A2 = new Vector3([AB[0].x - CD[0].x, AB[0].y - CD[0].y, 0]);
  const B2 = new Vector3([AB[1].x - CD[0].x, AB[1].y - CD[0].y, 0]);
  const C2 = new Vector3([0, 0, 0]);
  const D2 = new Vector3([CD[1].x - CD[0].x, CD[1].y - CD[0].y, 0]);

  const CDxCA = D2.cross(A2);
  const CDxCB = D2.cross(B2);

  if ((CDxCA.z > 0 && CDxCB.z > 0) || (CDxCA.z < 0 && CDxCB.z < 0)) return;

  const N = D2.toUnitVector().rotate90();

  const t = C.minus(A).dot(N) / B.minus(A).dot(N);

  const ptOnOrigin = B.minus(A).times(t).plus(A);
  const Pt = new Vector3([ptOnOrigin.x + AB[0].x, ptOnOrigin.y + AB[0].y, 0]);

  return Pt;
};
