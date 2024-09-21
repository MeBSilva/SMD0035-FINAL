import {
  findPseudoThetaByDotProduct,
  findPseudoThetaSquareMethod,
  findThetaByCrossProduct,
  findThetaByDotProduct,
} from "@/domain/findTheta";
import { Vector3 } from "@/domain/Vector";
import type p5 from "p5";
import type { Buttons } from "./UI/buttons";
import { drawArrow, drawSegment } from "./drawSegment";

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
  state: "angles" | "vectors" | "particles";
  collisionPoint: Vector3 | undefined;
  vectorPairs: [Vector3, Vector3][];
  p: p5;
  buttons: Buttons;
  defaultXOffset: number;
  defaultYOffset: number;
  points: number[];
}) => {
  if (state === "particles") {
    handleParticleMode({ buttons, p, defaultYOffset, defaultXOffset });

    return;
  }

  p.push();
  p.stroke("black").line(-p.width / 2, 0, p.width / 2, 0);
  p.stroke("black").line(0, -p.height / 2, 0, p.height / 2);
  p.pop();

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

  if (state === "angles")
    handleAngleMode({
      buttons,
      collisionPoint,
      defaultXOffset,
      defaultYOffset,
      p,
      vectorPairs,
    });

  if (state === "vectors")
    handleVectorMode({
      buttons,
      collisionPoint,
      defaultXOffset,
      defaultYOffset,
      p,
    });

  for (let i = 0; i < vectorPairs.length; i++) {
    const color: [number, number, number] =
      i === 0 ? [200, 50, 50] : i === 1 ? [50, 50, 200] : [50, 200, 50];
    const [origin, destination] = vectorPairs[i];
    destination.color = color;
    drawArrow(p, origin, destination);
  }
};

const handleAngleMode = ({
  buttons,
  vectorPairs,
  defaultXOffset,
  defaultYOffset,
  p,
}: {
  collisionPoint: Vector3 | undefined;
  p: p5;
  buttons: Buttons;
  defaultXOffset: number;
  defaultYOffset: number;
  vectorPairs: [Vector3, Vector3][];
}) => {
  buttons.angleModeButton.attribute("disabled", "true");
  buttons.particleModeButton.removeAttribute("disabled");
  buttons.vectorModeButton.removeAttribute("disabled");
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
};

const handleVectorMode = ({
  buttons,
  collisionPoint,
  p,
  defaultXOffset,
  defaultYOffset,
}: {
  collisionPoint: Vector3 | undefined;
  p: p5;
  buttons: Buttons;
  defaultXOffset: number;
  defaultYOffset: number;
}) => {
  buttons.angleModeButton.removeAttribute("disabled");
  buttons.particleModeButton.removeAttribute("disabled");
  buttons.vectorModeButton.attribute("disabled", "true");

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
};

const handleParticleMode = ({
  p,
  buttons,
  defaultYOffset,
  defaultXOffset,
}: {
  p: p5;
  buttons: Buttons;
  defaultYOffset: number;
  defaultXOffset: number;
}) => {
  buttons.angleModeButton.removeAttribute("disabled");
  buttons.particleModeButton.attribute("disabled", "true");
  buttons.vectorModeButton.removeAttribute("disabled");

  const screenLimits = {
    left: -p.width / 2 + defaultXOffset,
    right: p.width / 2 - defaultXOffset,
    top: p.height / 2 - defaultYOffset * 2,
    bottom: -p.height / 2 + defaultXOffset,
  };

  const topLeftLimit = new Vector3(
    [screenLimits.left, screenLimits.top, 0],
    [0, 0, 0],
  );
  const topRightLimit = new Vector3(
    [screenLimits.right, screenLimits.top, 0],
    [0, 0, 0],
  );
  const bottomLeftLimit = new Vector3(
    [screenLimits.left, screenLimits.bottom, 0],
    [0, 0, 0],
  );
  const bottomRightLimit = new Vector3(
    [screenLimits.right, screenLimits.bottom, 0],
    [0, 0, 0],
  );

  drawSegment(p, topLeftLimit, topRightLimit);
  drawSegment(p, topLeftLimit, bottomLeftLimit);
  drawSegment(p, bottomLeftLimit, bottomRightLimit);
  drawSegment(p, bottomRightLimit, topRightLimit);
};
