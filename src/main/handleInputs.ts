import { Vector3 } from "@/domain/Vector";
import type p5 from "p5";

export const handleInputs = ({
  points,
  vectorPairs,
  buttons,
  p,
}: {
  vectorPairs: [Vector3, Vector3][];
  points: number[];
  p: p5;
  buttons: {
    showSumButton: p5.Element;
    revertSumButton: p5.Element;
    collisionButton: p5.Element;
    clearButton: p5.Element;
  };
}) => {
  if (points.length === 4) {
    vectorPairs.push([
      new Vector3([points[0], points[1], 0]),
      new Vector3([points[2], points[3], 0]),
    ]);
    points.splice(0, points.length);
  }
  if (points.length === 2) {
    p.push();
    p.stroke("black").line(
      points[0],
      points[1],
      p.mouseX - p.width / 2,
      (p.mouseY - p.height / 2) * -1,
    );
    p.pop();
  }

  if (vectorPairs.length === 2) {
    buttons.showSumButton.removeAttribute("disabled");
    buttons.collisionButton.removeAttribute("disabled");
  }
  if (vectorPairs.length !== 2) {
    buttons.showSumButton.attribute("disabled", "true");
    buttons.collisionButton.attribute("disabled", "true");
  }
  if (vectorPairs.length === 3)
    buttons.revertSumButton.removeAttribute("disabled");
  if (vectorPairs.length !== 3)
    buttons.revertSumButton.attribute("disabled", "true");
};
