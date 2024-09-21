import { Vector3 } from "@/domain/Vector";
import type p5 from "p5";

export const drawArrow = (
  p: p5,
  originVector: Vector3,
  destinationVector: Vector3,
) => {
  const deltaX = destinationVector.x - originVector.x;
  const deltaY = destinationVector.y - originVector.y;

  const delta = new Vector3([deltaX, deltaY, 0]).toUnitVector();
  const trianglePoint1 = delta.rotate90().scale(3);
  const trianglePoint2 = delta.rotateMinus90().scale(3);
  const trianglePoint3 = delta.scale(4);

  p.push();
  drawSegment(p, originVector, destinationVector);
  p.fill(...destinationVector.color).triangle(
    trianglePoint1.x + destinationVector.x,
    trianglePoint1.y + destinationVector.y,
    trianglePoint2.x + destinationVector.x,
    trianglePoint2.y + destinationVector.y,
    trianglePoint3.x + destinationVector.x,
    trianglePoint3.y + destinationVector.y,
  );

  p.scale(1, -1);
  p.text(`${originVector.values}`, originVector.x, originVector.y * -1);
  p.text(
    `${destinationVector.values}`,
    destinationVector.x,
    destinationVector.y * -1,
  );
  p.pop();
};

export const drawSegment = (
  p: p5,
  originVector: Vector3,
  destinationVector: Vector3,
) => {
  p.push();
  p.stroke(...destinationVector.color).line(
    originVector.x,
    originVector.y,
    destinationVector.x,
    destinationVector.y,
  );
  p.pop();
};
