import { Vector } from "@/domain/Vector";
import p5 from "p5";

export const drawVector = (
  p: p5,
  originVector: Vector,
  destinationVector: Vector
) => {
  p.push();
  p.stroke(...destinationVector.color).line(
    originVector.x,
    originVector.y,
    destinationVector.x,
    destinationVector.y
  );
  p.scale(1, -1);
  p.text(`${originVector.values}`, originVector.x, originVector.y * -1);
  p.text(
    `${destinationVector.values}`,
    destinationVector.x,
    destinationVector.y * -1
  );
  p.pop();
};
