import { Vector3 } from "@/domain/Vector";
import p5 from "p5";
import { drawArrow } from "./drawArrow";
import { setupCartesian } from "./setupCartesian";
import { handleInputs } from "./handleInputs";
import { checkForCollision } from "@/domain/checkCollision";
import { handleUIState } from "./handleUIState";
import type { Buttons } from "./UI/buttons";

const sketch = (p: p5) => {
  let state: "angles" | "vectors" = "vectors";

  const vectorPairs: [Vector3, Vector3][] = [];
  const points: number[] = [];

  const defaultXOffset = 15;
  const defaultYOffset = 50;

  const buttons: Buttons = {} as Buttons;
  let collisionPoint: Vector3 | undefined;

  const revertSum = () => {
    const vec2Delta = new Vector3([
      0 - vectorPairs[1][0].x,
      0 - vectorPairs[1][0].y,
      0,
    ]);

    const newVector0 = [
      vectorPairs[1][0].translate(vec2Delta),
      vectorPairs[1][1].translate(vec2Delta),
    ] as [Vector3, Vector3];

    const vec1Delta = new Vector3([
      newVector0[1].x - vectorPairs[0][0].x,
      newVector0[1].y - vectorPairs[0][0].y,
      0,
    ]);

    const newVector1 = [
      vectorPairs[0][0].translate(vec1Delta),
      vectorPairs[0][1].translate(vec1Delta),
    ] as [Vector3, Vector3];

    vectorPairs[0] = newVector0;
    vectorPairs[1] = newVector1;
  };

  const handleSum = () => {
    const vec1Delta = new Vector3([
      0 - vectorPairs[0][0].x,
      0 - vectorPairs[0][0].y,
      0,
    ]);

    vectorPairs[0] = [
      vectorPairs[0][0].translate(vec1Delta),
      vectorPairs[0][1].translate(vec1Delta),
    ];

    const vec2Delta = new Vector3([
      vectorPairs[0][1].x - vectorPairs[1][0].x,
      vectorPairs[0][1].y - vectorPairs[1][0].y,
      0,
    ]);

    vectorPairs[1] = [
      vectorPairs[1][0].translate(vec2Delta),
      vectorPairs[1][1].translate(vec2Delta),
    ];

    const sumOrigin = vectorPairs[0][0].plus(vectorPairs[1][0]);
    const sumDeltaX = vectorPairs[0][0].x - sumOrigin.x;
    const sumDeltaY = vectorPairs[0][0].y - sumOrigin.y;
    const sumDelta = new Vector3([sumDeltaX, sumDeltaY, 0]);

    vectorPairs.push([
      sumOrigin.translate(sumDelta),
      vectorPairs[0][1].plus(vectorPairs[1][1]).translate(sumDelta),
    ]);
  };

  const handleCollision = () => {
    if (vectorPairs.length >= 2) {
      collisionPoint = checkForCollision(vectorPairs[0], vectorPairs[1]);
      return;
    }
    collisionPoint = undefined;
  };

  const clearBoard = () => {
    points.splice(0, points.length);
    vectorPairs.splice(0, vectorPairs.length);
    collisionPoint = undefined;
  };

  const isMouseHittingNav = () => {
    if (
      p.mouseX >= defaultXOffset &&
      p.mouseX <= p.width - defaultXOffset &&
      p.mouseY >= defaultYOffset &&
      p.mouseY <= 30 + defaultYOffset
    )
      return true;

    return false;
  };

  p.mousePressed = (_) => {
    if (
      p.mouseButton === p.LEFT &&
      !isMouseHittingNav() &&
      vectorPairs.length < 2
    ) {
      points.push(p.mouseX - p.width / 2, (p.mouseY - p.height / 2) * -1);
    }
  };

  p.setup = () => {
    p.frameRate(60);

    p.createCanvas(p.windowWidth, p.windowHeight);

    buttons.collisionButton = p
      .createButton("check for collisions")
      .position(defaultXOffset, defaultYOffset)
      .attribute("disabled", "true")
      .mousePressed(handleCollision);
    buttons.showSumButton = p
      .createButton("visualize addition")
      .position(
        defaultXOffset * 2 + buttons.collisionButton.width,
        defaultYOffset,
      )
      .attribute("disabled", "true")
      .mousePressed(handleSum);
    buttons.revertSumButton = p
      .createButton("revert addition order")
      .position(
        defaultXOffset * 3 +
          buttons.collisionButton.width +
          buttons.showSumButton.width,
        defaultYOffset,
      )
      .attribute("disabled", "true")
      .mousePressed(revertSum);
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
  };

  p.draw = () => {
    setupCartesian(p);
    handleUIState({
      buttons,
      p,
      state,
      vectorPairs,
      collisionPoint,
      defaultXOffset,
      defaultYOffset,
      points,
    });

    for (let i = 0; i < vectorPairs.length; i++) {
      const color: [number, number, number] =
        i === 0 ? [200, 50, 50] : i === 1 ? [50, 50, 200] : [50, 200, 50];
      const [origin, destination] = vectorPairs[i];
      destination.color = color;
      drawArrow(p, origin, destination);
    }
  };
};

const myp5 = new p5(sketch, document.body);
