import {
  findPseudoThetaByDotProduct,
  findPseudoThetaSquareMethod,
  findThetaByCrossProduct,
  findThetaByDotProduct,
} from "@/domain/findTheta";
import type p5 from "p5";
import type { Buttons } from "./UI/buttons";
import { drawArrow, drawSegment } from "./drawSegment";
import type { Segment3 } from "@/domain/Segment";
import type { Vector3 } from "@/domain/Vector";
import type { Particle } from "./actors/particle";

export const handleUIState = ({
  p,
  state,
  buttons,
  segments,
  defaultXOffset,
  defaultYOffset,
  collisionPoint,
  particles,
}: {
  state: "angles" | "vectors" | "particles";
  collisionPoint: Vector3 | undefined;
  segments: Segment3[];
  p: p5;
  buttons: Buttons;
  defaultXOffset: number;
  defaultYOffset: number;
  particles: Particle[];
}) => {
  p.push();
  p.stroke("black").line(-p.width / 2, 0, p.width / 2, 0);
  p.stroke("black").line(0, -p.height / 2, 0, p.height / 2);
  p.pop();

  if (segments.length === 2) {
    buttons.showSumButton.removeAttribute("disabled");
    buttons.collisionButton.removeAttribute("disabled");
  }
  if (segments.length !== 2) {
    buttons.showSumButton.attribute("disabled", "true");
    buttons.collisionButton.attribute("disabled", "true");
  }
  if (segments.length === 3)
    buttons.revertSumButton.removeAttribute("disabled");
  if (segments.length !== 3)
    buttons.revertSumButton.attribute("disabled", "true");

  if (state === "particles") {
    handleParticleMode({
      buttons,
      particles,
      segments,
      defaultXOffset,
      defaultYOffset,
      p,
    });
  }

  if (state === "angles")
    handleAngleMode({
      buttons,
      collisionPoint,
      defaultXOffset,
      defaultYOffset,
      p,
      segments,
    });

  if (state === "vectors")
    handleVectorMode({
      buttons,
      collisionPoint,
      defaultXOffset,
      defaultYOffset,
      p,
    });

  for (let i = 0; i < segments.length; i++) {
    const [origin, destination] = segments[i];
    if (state === "particles") {
      drawSegment(p, origin, destination);
    } else {
      const color: [number, number, number] =
        i === 0 ? [200, 50, 50] : i === 1 ? [50, 50, 200] : [50, 200, 50];
      destination.color = color;
      drawArrow(p, origin, destination);
    }
  }
};

const handleAngleMode = ({
  buttons,
  segments,
  defaultXOffset,
  defaultYOffset,
  p,
}: {
  collisionPoint: Vector3 | undefined;
  p: p5;
  buttons: Buttons;
  defaultXOffset: number;
  defaultYOffset: number;
  segments: Segment3[];
}) => {
  buttons.angleModeButton.attribute("disabled", "true");
  buttons.particleModeButton.removeAttribute("disabled");
  buttons.vectorModeButton.removeAttribute("disabled");
  if (segments.length === 2) {
    p.push();
    p.scale(1, -1);
    p.textSize(15);
    p.text(
      `Theta (dot) = ${findThetaByDotProduct(segments[0][1], segments[1][1])}º`,
      -p.width / 2 + defaultXOffset,
      -p.height / 2 + buttons.collisionButton.height * 4 + defaultYOffset,
    );
    p.text(
      `Theta (cross) = ${findThetaByCrossProduct(segments[0][1], segments[1][1])}º`,
      -p.width / 2 + defaultXOffset,
      -p.height / 2 + buttons.collisionButton.height * 5 + defaultYOffset,
    );
    p.text(
      `Pseudo theta (dot) = ${findPseudoThetaByDotProduct(segments[0][1], segments[1][1])}º`,
      -p.width / 2 + defaultXOffset,
      -p.height / 2 + buttons.collisionButton.height * 6 + defaultYOffset,
    );
    p.text(
      `Pseudo theta (octant) = ${findPseudoThetaSquareMethod(segments[0][1], segments[1][1])}º`,
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
  buttons,
  particles,
  segments,
  defaultXOffset,
  defaultYOffset,
  p,
}: {
  buttons: Buttons;
  particles: Particle[];
  segments: Segment3[];
  p: p5;
  defaultXOffset: number;
  defaultYOffset: number;
}) => {
  buttons.angleModeButton.removeAttribute("disabled");
  buttons.particleModeButton.attribute("disabled", "true");
  buttons.vectorModeButton.removeAttribute("disabled");

  for (const particle of particles) {
    particle.updateMovementState(
      segments,
      // 	 () => {
      //   const { bottom, left, right, top } = {
      //     left: -p.width / 2 + defaultXOffset,
      //     right: p.width / 2 - defaultXOffset,
      //     top: p.height / 2 - defaultYOffset * 2,
      //     bottom: -p.height / 2 + defaultXOffset,
      //   };

      //   segments.push([
      //     new Vector3([
      //       Math.random() * (right - left) + left,
      //       Math.random() * (top - bottom) + bottom,
      //       0,
      //     ]),

      //     new Vector3(
      //       [
      //         Math.random() * (right - left) + left,
      //         Math.random() * (top - bottom) + bottom,
      //         0,
      //       ],
      //       [0, 0, 0],
      //     ),
      //   ]);
      // }
    );
    particle.draw();
  }
};
