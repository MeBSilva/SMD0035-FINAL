import { Vector3 } from "@/domain/Vector";
import p5 from "p5";
import { setupCartesian } from "./setupCartesian";
import { handleUIState } from "./handleUIState";
import type { Buttons } from "./UI/buttons";
import { Particle } from "./actors/particle";
import {
  handleCollision,
  handleMousePress,
  revertSegmentSum,
  sumSegments,
} from "./utils";
import type { Segment3 } from "@/domain/Segment";

const sketch = (p: p5) => {
  let state: "angles" | "vectors" | "particles" = "vectors";

  let particle: Particle | undefined;
  let segments: Segment3[] = [];
  const points: number[] = [];

  const defaultXOffset = 15;
  const defaultYOffset = 50;

  const buttons: Buttons = {} as Buttons;
  let collisionPoint: Vector3 | undefined;

  const clearBoard = () => {
    points.splice(0, points.length);
    segments = [];
    collisionPoint = undefined;
    particle = undefined;
  };

  p.mousePressed = (_) => {
    const newPoints = handleMousePress({
      p,
      segments,
      defaultXOffset,
      defaultYOffset,
    });
    points.push(...newPoints);
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
        if (segments.length >= 2)
          segments = sumSegments(segments as [Segment3, Segment3]);
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
        if (segments.length >= 3)
          segments = revertSegmentSum(
            segments as [Segment3, Segment3, Segment3],
          );
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
        particle = new Particle(
          p,
          10,
          new Vector3([0, 0, 0]),
          new Vector3([1, 1, 0]),
        );
        state = "particles";
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
      points,
    });

    if (state === "particles") {
      particle?.updateMovementState();
      particle?.draw();
    }
  };
};

const myp5 = new p5(sketch, document.body);
