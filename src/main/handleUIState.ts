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
import { Vector3 } from "@/domain/Vector";
import type { Particle } from "./actors/particle";
import type { AppState } from "./utils";
import type { Volume } from "./calculations/volumes";

export const handleUIState = ({
  p,
  state,
  buttons,
  segments,
  defaultXOffset,
  defaultYOffset,
  collisionPoint,
  particles,
  points,
  volumes,
}: {
  state: AppState;
  collisionPoint: Vector3 | undefined;
  segments: Segment3[];
  p: p5;
  buttons: Buttons;
  defaultXOffset: number;
  defaultYOffset: number;
  particles: Particle[];
  volumes: Volume[];
  points: number[];
}) => {
  p.push();
  p.stroke("black").line(-p.width / 2, 0, p.width / 2, 0);
  p.stroke("black").line(0, -p.height / 2, 0, p.height / 2);
  p.pop();

  if (state === "vectors" || state === "angles") {
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
  }

  if (state !== "volumes") {
    if (points.length === 4) {
      segments.push([
        new Vector3([points[0], points[1], 0]),
        new Vector3([points[2], points[3], 0]),
      ]);
      points.splice(0, points.length);
      if (state === "angles" && segments.length < 2) {
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
  }

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

  if (state === "volumes")
    handleVolumeMode({
      buttons,
      particles,
      segments,
      defaultXOffset,
      defaultYOffset,
      volumes,
      p,
    });
  else {
    buttons.createAABBFromPointsButton.attribute("hidden", "true");
    buttons.createOBBFromPointsButton.attribute("hidden", "true");
    buttons.createCircleFromPointsButton.attribute("hidden", "true");

    buttons.collisionButton.removeAttribute("hidden");
    buttons.showSumButton.removeAttribute("hidden");
    buttons.revertSumButton.removeAttribute("hidden");
  }

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
  buttons.volumeModeButton.removeAttribute("disabled");
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
  buttons.volumeModeButton.removeAttribute("disabled");

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
  buttons.volumeModeButton.removeAttribute("disabled");

  for (const particle of particles) {
    particle.updateMovementState(segments, () => {
      if (segments.length > 15) return;
      const { bottom, left, right, top } = {
        left: -p.width / 2 + defaultXOffset,
        right: p.width / 2 - defaultXOffset,
        top: p.height / 2 - defaultYOffset * 2,
        bottom: -p.height / 2 + defaultXOffset,
      };

      segments.push([
        new Vector3([
          Math.random() * (right - left) + left,
          Math.random() * (top - bottom) + bottom,
          0,
        ]),

        new Vector3(
          [
            Math.random() * (right - left) + left,
            Math.random() * (top - bottom) + bottom,
            0,
          ],
          [0, 0, 0],
        ),
      ]);
    });
    particle.draw();
  }
};

const handleVolumeMode = ({
  buttons,
  particles,
  segments,
  defaultXOffset,
  defaultYOffset,
  p,
  volumes,
}: {
  buttons: Buttons;
  particles: Particle[];
  volumes: Volume[];
  segments: Segment3[];
  p: p5;
  defaultXOffset: number;
  defaultYOffset: number;
}) => {
  buttons.angleModeButton.removeAttribute("disabled");
  buttons.particleModeButton.removeAttribute("disabled");
  buttons.vectorModeButton.removeAttribute("disabled");
  buttons.volumeModeButton.attribute("disabled", "true");

  buttons.collisionButton.attribute("hidden", "true");
  buttons.showSumButton.attribute("hidden", "true");
  buttons.revertSumButton.attribute("hidden", "true");

  buttons.createAABBFromPointsButton.removeAttribute("hidden");
  buttons.createOBBFromPointsButton.removeAttribute("hidden");
  buttons.createCircleFromPointsButton.removeAttribute("hidden");

  for (const particle of particles) {
    particle.draw();
  }
  for (const volume of volumes) {
    volume.draw();
  }
};
