import type { Segment3 } from "@/domain/Segment";
import { Vector3 } from "@/domain/Vector";
import { checkForCollision } from "@/domain/checkCollision";

export const revertSegmentSum = ([A, B, C]: [Segment3, Segment3, Segment3]): [
  Segment3,
  Segment3,
  Segment3,
] => {
  const bDelta = new Vector3([0 - B[0].x, 0 - B[0].y, 0]);

  const bAtOrigin = [
    B[0].translate(bDelta),
    B[1].translate(bDelta),
  ] as Segment3;

  const aDelta = new Vector3([
    bAtOrigin[1].x - A[0].x,
    bAtOrigin[1].y - A[0].y,
    0,
  ]);

  const aAtOrigin = [
    A[0].translate(aDelta),
    A[1].translate(aDelta),
  ] as Segment3;

  return [bAtOrigin, aAtOrigin, C];
};

export const sumSegments = ([A, B]: [Segment3, Segment3]): [
  Segment3,
  Segment3,
  Segment3,
] => {
  const aDelta = new Vector3([0 - A[0].x, 0 - A[0].y, 0]);
  const aAtOrigin: Segment3 = [A[0].translate(aDelta), A[1].translate(aDelta)];

  const bDelta = new Vector3([
    aAtOrigin[1].x - B[0].x,
    aAtOrigin[1].y - B[0].y,
    0,
  ]);
  const bAtOrigin: Segment3 = [B[0].translate(bDelta), B[1].translate(bDelta)];

  const sumOrigin = aAtOrigin[0].plus(bAtOrigin[0]);
  const sumDeltaX = aAtOrigin[0].x - sumOrigin.x;
  const sumDeltaY = aAtOrigin[0].y - sumOrigin.y;
  const sumDelta = new Vector3([sumDeltaX, sumDeltaY, 0]);

  return [
    aAtOrigin,
    bAtOrigin,
    [
      sumOrigin.translate(sumDelta),
      aAtOrigin[1].plus(bAtOrigin[1]).translate(sumDelta),
    ],
  ];
};

export const handleCollision = ({
  segments,
}: {
  segments: Segment3[];
}): undefined | Vector3 => {
  if (segments.length >= 2) return checkForCollision(segments[0], segments[1]);
};
