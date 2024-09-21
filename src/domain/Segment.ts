import type { Vector3 } from "./Vector";

export type Segment3 = [Vector3, Vector3];

export const getLimits = (
  segment: Segment3,
): { left: number; right: number; top: number; bottom: number } => ({
  bottom: segment[0].y < segment[1].y ? segment[0].y : segment[1].y,
  left: segment[0].x < segment[1].x ? segment[0].x : segment[1].x,
  right: segment[0].x > segment[1].x ? segment[0].x : segment[1].x,
  top: segment[0].y > segment[1].y ? segment[0].y : segment[1].y,
});
