import { Vector3 } from "@/domain/Vector";
import p5, { Vector } from "p5";
import { setupCartesian } from "./setupCartesian";
import { handleUIState } from "./handleUIState";
import type { Buttons } from "./UI/buttons";
import { Particle } from "./actors/particle";
import { type AppState, handleMousePress } from "./utils";
import type { Segment3 } from "@/domain/Segment";
import {
  handleCollision,
  revertSegmentSum,
  sumSegments,
} from "./calculations/vectors";

const sketch = (p: p5) => {
  let state: AppState = "vectors";

  const particles: Particle[] = [];
  const segments: Segment3[] = [];
  const points: number[] = [];

  const defaultXOffset = 15;
  const defaultYOffset = 50;

  const buttons: Buttons = {} as Buttons;
  let collisionPoint: Vector3 | undefined;

  const makeParticle = () =>
    new Particle(
      p,
      10,
      new Vector3([0, p.height / 2 - 140, 0]),
      new Vector3([10, 10, 0]),
    );

  const clearBoard = () => {
    points.splice(0, points.length);
    segments.splice(0, segments.length);
    collisionPoint = undefined;
    particles.splice(0, particles.length);
  };

  p.mousePressed = (_) => {
    const newPoints = handleMousePress({
      p,
      segments,
      defaultXOffset,
      defaultYOffset,
      state,
    });
    if (state === "volumes")
      particles.push(
        new Particle(
          p,
          10,
          new Vector3([newPoints[0], newPoints[1], 0]),
          new Vector3(),
        ),
      );
    else points.push(...newPoints);
  };

  p.setup = () => {
    p.frameRate(60);

    p.createCanvas(p.windowWidth, p.windowHeight);

    buttons.collisionButton = p
      .createButton("check for collisions")
      .position(defaultXOffset, defaultYOffset)
      .attribute("disabled", "true")
      .mousePressed(() => {
        collisionPoint = handleCollision({ segments });
      });
    buttons.showSumButton = p
      .createButton("visualize addition")
      .position(
        defaultXOffset * 2 + buttons.collisionButton.width,
        defaultYOffset,
      )
      .attribute("disabled", "true")
      .mousePressed(() => {
        if (segments.length >= 2) {
          const result = sumSegments(segments as [Segment3, Segment3]);
          clearBoard();
          segments.push(...result);
        }
      });
    buttons.revertSumButton = p
      .createButton("revert addition order")
      .position(
        defaultXOffset * 3 +
          buttons.collisionButton.width +
          buttons.showSumButton.width,
        defaultYOffset,
      )
      .attribute("disabled", "true")
      .mousePressed(() => {
        if (segments.length >= 3) {
          const result = revertSegmentSum(
            segments as [Segment3, Segment3, Segment3],
          );
          clearBoard();
          segments.push(...result);
        }
      });
    buttons.clearButton = p
      .createButton("clear")
      .position(
        defaultXOffset * 4 +
          buttons.collisionButton.width +
          buttons.revertSumButton.width +
          buttons.showSumButton.width,
        defaultYOffset,
      )
      .mousePressed(() => {
        clearBoard();
        if (state === "angles") points.push(0, 0);
      });
    buttons.vectorModeButton = p
      .createButton("change to vector mode")
      .position(
        defaultXOffset * 5 +
          buttons.clearButton.width +
          buttons.collisionButton.width +
          buttons.revertSumButton.width +
          buttons.showSumButton.width,
        defaultYOffset,
      )
      .mousePressed(() => {
        clearBoard();
        state = "vectors";
      });
    buttons.angleModeButton = p
      .createButton("change to angle mode")
      .position(
        defaultXOffset * 6 +
          buttons.clearButton.width +
          buttons.collisionButton.width +
          buttons.revertSumButton.width +
          buttons.vectorModeButton.width +
          buttons.showSumButton.width,
        defaultYOffset,
      )
      .mousePressed(() => {
        clearBoard();
        points.push(0, 0);
        state = "angles";
      });
    buttons.particleModeButton = p
      .createButton("change to particle mode")
      .position(
        defaultXOffset * 7 +
          buttons.clearButton.width +
          buttons.collisionButton.width +
          buttons.revertSumButton.width +
          buttons.vectorModeButton.width +
          buttons.angleModeButton.width +
          buttons.showSumButton.width,
        defaultYOffset,
      )
      .mousePressed(() => {
        clearBoard();

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

        segments.push(
          ...[
            [topLeftLimit, topRightLimit] as Segment3,
            [topLeftLimit, bottomLeftLimit] as Segment3,
            [bottomLeftLimit, bottomRightLimit] as Segment3,
            [bottomRightLimit, topRightLimit] as Segment3,
          ],
        );

        particles.push(makeParticle());
        state = "particles";
      });
    buttons.volumeModeButton = p
      .createButton("change to volume mode")
      .position(
        defaultXOffset * 8 +
          buttons.clearButton.width +
          buttons.collisionButton.width +
          buttons.revertSumButton.width +
          buttons.vectorModeButton.width +
          buttons.angleModeButton.width +
          buttons.particleModeButton.width +
          buttons.showSumButton.width,
        defaultYOffset,
      )
      .mousePressed(() => {
        clearBoard();
        state = "volumes";
      });
    buttons.createAABBFromPointsButton = p
      .createButton("create AABB")
      .position(defaultXOffset * 3, defaultYOffset)
      .mousePressed(() => {
        clearBoard();
      });
    buttons.createOBBFromPointsButton = p
      .createButton("create OBB")
      .position(
        defaultXOffset * 4 + buttons.createAABBFromPointsButton.width,
        defaultYOffset,
      )
      .mousePressed(() => {
        clearBoard();
      });
    buttons.createCircleFromPointsButton = p
      .createButton("create circle")
      .position(
        defaultXOffset * 5 +
          buttons.createAABBFromPointsButton.width +
          buttons.createOBBFromPointsButton.width,
        defaultYOffset,
      )
      .mousePressed(() => {
        clearBoard();
      });
  };

  p.draw = () => {
    setupCartesian(p);

    handleUIState({
      buttons,
      p,
      state,
      segments,
      collisionPoint,
      defaultXOffset,
      defaultYOffset,
      particles,
      points,
    });
  };
};

const myp5 = new p5(sketch, document.body);
