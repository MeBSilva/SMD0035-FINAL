import type { Vector3 } from "./Vector";

const clamp = (num: number, a: number, b: number) =>
  Math.min(Math.max(num, a), b);

export const findThetaByDotProduct = (u: Vector3, v: Vector3) => {
  if (u.isNull() || v.isNull()) return 0;
  const cosineTheta = clamp(u.dot(v) / (u.norm() * v.norm()), -1, 1);

  return (Math.acos(cosineTheta) * (180 / Math.PI)).toFixed(2);
};

export const findThetaByCrossProduct = (u: Vector3, v: Vector3) => {
  if (u.isNull() || v.isNull()) return 0;
  const sinTheta = clamp(u.cross(v).norm() / (u.norm() * v.norm()), -1, 1);

  return (Math.asin(sinTheta) * (180 / Math.PI)).toFixed(2);
};

export const findPseudoThetaByDotProduct = (u: Vector3, v: Vector3) => {
  if (u.isNull() || v.isNull()) return 0;
  const cosineTheta = 1 - clamp(u.dot(v) / (u.norm() * v.norm()), -1, 1);

  return (cosineTheta * (180 / Math.PI)).toFixed(2);
};

export const findPseudoThetaSquareMethod = (u: Vector3, v: Vector3) => {
  if (u.isNull() || v.isNull()) return 0;

  return Math.abs(
    u.findPseudoAngleWithXAxis() - v.findPseudoAngleWithXAxis(),
  ).toFixed(2);
};
