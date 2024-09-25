import { Vector3 } from "@/domain/Vector";
import p5, { Vector } from "p5";
import { setupCartesian } from "./setupCartesian";
import { handleUIState } from "./handleUIState";
import type { Buttons } from "./UI/buttons";
import { Particle } from "./actors/particle";
import {
  type AppState,
  handleMousePress,
  type VolumeSelectionMode,
} from "./utils";
import type { Segment3 } from "@/domain/Segment";
import {
  handleCollision,
  revertSegmentSum,
  sumSegments,
} from "./calculations/vectors";
import {
  generateAABB,
  generateOBB,
  generateCircle,
  type Volume,
} from "./calculations/volumes";

const sketch = (p: p5) => {
  let state: AppState = "vectors";
  let selectionMode: VolumeSelectionMode = "create point";

  const particles: Particle[] = [];
  const segments: Segment3[] = [];
  const points: number[] = [];
  const volumes: Volume[] = [];

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
    volumes.splice(0, volumes.length);
  };

  p.mousePressed = (_) => {
    const newPoints = handleMousePress({
      p,
      segments,
      defaultXOffset,
      defaultYOffset,
      state,
    });
    if (
      state === "volumes" &&
      newPoints.length > 0 &&
      selectionMode === "select volume"
    ) {
      const selectables = (particles as Volume[]).concat(volumes);
      const selected = selectables.filter((elem) => elem.isSelected);

      for (const selectable of selectables) {
        if (selectable.contains(new Vector3([newPoints[0], newPoints[1], 0]))) {
          if (selected.length < 2 || selectable.isSelected) {
            selectable.changeState();
            return;
          }
        }
      }

      return;
    }
    if (state === "volumes" && newPoints.length > 0)
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
      .position(defaultXOffset, defaultYOffset)
      .mousePressed(() => {
        volumes.push(
          generateAABB(
            p,
            particles.map((particle) => particle.center),
          ),
        );
      });
    buttons.createOBBFromPointsButton = p
      .createButton("create OBB")
      .position(
        defaultXOffset * 2 + buttons.createAABBFromPointsButton.width,
        defaultYOffset,
      )
      .mousePressed(() => {
        volumes.push(
          generateOBB(
            p,
            particles.map((particle) => particle.center),
          ),
        );
      });
    buttons.createCircleFromPointsButton = p
      .createButton("create circle")
      .position(
        defaultXOffset * 3 +
          buttons.createAABBFromPointsButton.width +
          buttons.createOBBFromPointsButton.width,
        defaultYOffset,
      )
      .mousePressed(() => {
        volumes.push(
          generateCircle(
            p,
            particles.map((particle) => particle.center),
            100000,
          ),
        );
      });
    buttons.generateVertexCloudButton = p
      .createButton("create cloud")
      .position(
        defaultXOffset * 4 +
          buttons.createAABBFromPointsButton.width +
          buttons.createOBBFromPointsButton.width +
          buttons.createCircleFromPointsButton.width,
        defaultYOffset,
      )
      .mousePressed(() => {
        const { bottom, left, right, top } = {
          left: -p.width / 2 + defaultXOffset,
          right: p.width / 2 - defaultXOffset,
          top: p.height / 2 - defaultYOffset * 2,
          bottom: -p.height / 2 + defaultXOffset,
        };
        particles.push(
          ...Array.from(
            Array(10),
            () =>
              new Particle(
                p,
                10,
                new Vector3([
                  Math.random() * (right / 2 - left / 2) + left / 2,
                  Math.random() * (top / 2 - bottom / 2) + bottom / 2,
                  0,
                ]),
                new Vector3(),
              ),
          ),
        );
      });
    buttons.selectionModeButton = p
      .createButton("selection mode")
      .position(defaultXOffset, defaultYOffset * 2)
      .mousePressed(() => {
        selectionMode = "select volume";
      });
    buttons.createVertexModeButton = p
      .createButton("create point mode")
      .position(
        defaultXOffset * 2 + buttons.selectionModeButton.width,
        defaultYOffset * 2,
      )
      .mousePressed(() => {
        selectionMode = "create point";
      });
  };

  p.draw = () => {
    setupCartesian(p);

    handleUIState({
      buttons,
      p,
      state,
      selectionMode,
      segments,
      collisionPoint,
      defaultXOffset,
      defaultYOffset,
      particles,
      points,
      volumes,
    });
  };
};

const myp5 = new p5(sketch, document.body);
