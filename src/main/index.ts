import { Vector, Vector3 } from "@/domain/Vector";
import p5 from "p5";
import { drawArrow } from "./drawArrow";
import { setupCartesian } from "./setupCartesian";
import { handleInputs } from "./handleInputs";

const sketch = (p: p5) => {
  const vectorPairs: [Vector3, Vector3][] = [];
  const points: number[] = [];

  const defaultXOffset = 15;
  const defaultYOffset = 50;

  const buttons: {
    showSumButton: p5.Element;
    revertSumButton: p5.Element;
    // collisionButton: p5.Element;
    clearButton: p5.Element;
  } = {} as typeof buttons;
  // let collisionButton: p5.Element;
  let hasCollision = false;

  const revertSum = () => {
    vectorPairs.splice(2, vectorPairs.length);

    const vec2Delta = new Vector3([
      0 - vectorPairs[1][0].x,
      0 - vectorPairs[1][0].y,
      0,
    ]);

    vectorPairs[1] = [
      vectorPairs[1][0].translate(vec2Delta),
      vectorPairs[1][1].translate(vec2Delta),
    ];

    const vec1Delta = new Vector3([
      vectorPairs[1][1].x - vectorPairs[0][0].x,
      vectorPairs[1][1].y - vectorPairs[0][0].y,
      0,
    ]);

    vectorPairs[0] = [
      vectorPairs[0][0].translate(vec1Delta),
      vectorPairs[0][1].translate(vec1Delta),
    ];

    const sumOrigin = vectorPairs[1][0].plus(vectorPairs[0][0]);
    const sumDeltaX = vectorPairs[1][0].x - sumOrigin.x;
    const sumDeltaY = vectorPairs[1][0].y - sumOrigin.y;
    const sumDelta = new Vector3([sumDeltaX, sumDeltaY, 0]);

    vectorPairs.push([
      sumOrigin.translate(sumDelta),
      vectorPairs[1][1].plus(vectorPairs[0][1]).translate(sumDelta),
    ]);
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

  // const handleCollision = () => {
  //   if (vectorPairs.length >= 2) {
  //     hasCollision = Vector.hasCollisionWith(vectorPairs[0], vectorPairs[1]);
  //     return;
  //   }
  //   hasCollision = false;
  // };

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

    // buttons.collisionButton = p
    //   .createButton("check for collisions")
    //   .position(defaultXOffset, defaultYOffset)
    //   .attribute("disabled", "true")
    //   .mousePressed(handleCollision);
    buttons.showSumButton = p
      .createButton("visualize addition")
      .position(defaultXOffset, defaultYOffset)
      .attribute("disabled", "true")
      .mousePressed(handleSum);
    buttons.revertSumButton = p
      .createButton("revert addition order")
      .position(
        defaultXOffset * 2 + buttons.showSumButton.width,
        defaultYOffset,
      )
      .attribute("disabled", "true")
      .mousePressed(revertSum);
    buttons.clearButton = p
      .createButton("clear")
      .position(
        defaultXOffset * 3 +
          buttons.revertSumButton.width +
          buttons.showSumButton.width,
        defaultYOffset,
      )
      .mousePressed(() => {
        vectorPairs.splice(0, vectorPairs.length);
        hasCollision = false;
      });
  };

  p.draw = () => {
    setupCartesian(p);
    handleInputs({ p, buttons, points, vectorPairs });
    // p.push();
    // p.scale(1, -1);
    // p.textSize(15);
    // p.text(`Possui colisão? ${hasCollision}`, 0, 0);
    // p.pop();

    for (const [origin, destination] of vectorPairs) {
      drawArrow(p, origin, destination);
    }
  };
};

const myp5 = new p5(sketch, document.body);
