import {
  findPseudoThetaByDotProduct,
  findPseudoThetaSquareMethod,
  findThetaByCrossProduct,
  findThetaByDotProduct,
} from "@/domain/findTheta";
import { Vector3 } from "@/domain/Vector";
import type p5 from "p5";
import type { Buttons } from "./UI/buttons";

export const handleUIState = ({
  p,
  state,
  buttons,
  vectorPairs,
  defaultXOffset,
  defaultYOffset,
  collisionPoint,
  points,
}: {
  state: "angles" | "vectors";
  collisionPoint: Vector3 | undefined;
  vectorPairs: [Vector3, Vector3][];
  p: p5;
  buttons: Buttons;
  defaultXOffset: number;
  defaultYOffset: number;
  points: number[];
}) => {
  if (points.length === 4) {
    vectorPairs.push([
      new Vector3([points[0], points[1], 0]),
      new Vector3([points[2], points[3], 0]),
    ]);
    points.splice(0, points.length);
    if (state === "angles" && vectorPairs.length < 2) {
      points.push(0, 0);
    }
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

  if (state === "angles") {
    if (vectorPairs.length === 2) {
      p.push();
      p.scale(1, -1);
      p.textSize(15);
      p.text(
        `Theta (dot) = ${findThetaByDotProduct(vectorPairs[0][1], vectorPairs[1][1])}º`,
        -p.width / 2 + defaultXOffset,
        -p.height / 2 + buttons.collisionButton.height * 4 + defaultYOffset,
      );
      p.text(
        `Theta (cross) = ${findThetaByCrossProduct(vectorPairs[0][1], vectorPairs[1][1])}º`,
        -p.width / 2 + defaultXOffset,
        -p.height / 2 + buttons.collisionButton.height * 5 + defaultYOffset,
      );
      p.text(
        `Pseudo theta (dot) = ${findPseudoThetaByDotProduct(vectorPairs[0][1], vectorPairs[1][1])}º`,
        -p.width / 2 + defaultXOffset,
        -p.height / 2 + buttons.collisionButton.height * 6 + defaultYOffset,
      );
      p.text(
        `Pseudo theta (octant) = ${findPseudoThetaSquareMethod(vectorPairs[0][1], vectorPairs[1][1])}º`,
        -p.width / 2 + defaultXOffset,
        -p.height / 2 + buttons.collisionButton.height * 7 + defaultYOffset,
      );
      p.pop();
    }
    p.push();
    p.rectMode("center");
    p.fill(180, 180, 180, 0);
    p.rect(0, 0, 200, 200);
    p.pop();
  }
  if (state === "vectors") {
    p.push();
    if (collisionPoint) p.circle(collisionPoint.x, collisionPoint.y, 10);
    p.scale(1, -1);
    p.textSize(15);
    p.text(
      `Possui colisão? ${!!collisionPoint}`,
      -p.width / 2 + defaultXOffset,
      -p.height / 2 + buttons.collisionButton.height * 2 + defaultYOffset,
    );
    p.pop();
  }
};
