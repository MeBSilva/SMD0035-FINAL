import p5 from "p5";
import { drawVector } from "./drawVector";
import { Vector } from "@/domain/Vector";

const sketch = (p: p5) => {
  const vectorPairs: [Vector, Vector][] = [];
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

    const vec2Delta = new Vector([
      0 - vectorPairs[1][0].x,
      0 - vectorPairs[1][0].y
    ]);

    vectorPairs[1] = [
      vectorPairs[1][0].translate(vec2Delta),
      vectorPairs[1][1].translate(vec2Delta)
    ];

    const vec1Delta = new Vector([
      vectorPairs[1][1].x - vectorPairs[0][0].x,
      vectorPairs[1][1].y - vectorPairs[0][0].y
    ]);

    vectorPairs[0] = [
      vectorPairs[0][0].translate(vec1Delta),
      vectorPairs[0][1].translate(vec1Delta)
    ];

    const sumOrigin = vectorPairs[1][0].plus(vectorPairs[0][0]);
    const sumDeltaX = vectorPairs[1][0].x - sumOrigin.x;
    const sumDeltaY = vectorPairs[1][0].y - sumOrigin.y;
    const sumDelta = new Vector([sumDeltaX, sumDeltaY]);

    vectorPairs.push([
      sumOrigin.translate(sumDelta),
      vectorPairs[1][1].plus(vectorPairs[0][1]).translate(sumDelta)
    ]);
  };

  const handleSum = () => {
    const vec1Delta = new Vector([
      0 - vectorPairs[0][0].x,
      0 - vectorPairs[0][0].y
    ]);

    vectorPairs[0] = [
      vectorPairs[0][0].translate(vec1Delta),
      vectorPairs[0][1].translate(vec1Delta)
    ];

    const vec2Delta = new Vector([
      vectorPairs[0][1].x - vectorPairs[1][0].x,
      vectorPairs[0][1].y - vectorPairs[1][0].y
    ]);

    vectorPairs[1] = [
      vectorPairs[1][0].translate(vec2Delta),
      vectorPairs[1][1].translate(vec2Delta)
    ];

    const sumOrigin = vectorPairs[0][0].plus(vectorPairs[1][0]);
    const sumDeltaX = vectorPairs[0][0].x - sumOrigin.x;
    const sumDeltaY = vectorPairs[0][0].y - sumOrigin.y;
    const sumDelta = new Vector([sumDeltaX, sumDeltaY]);

    vectorPairs.push([
      sumOrigin.translate(sumDelta),
      vectorPairs[0][1].plus(vectorPairs[1][1]).translate(sumDelta)
    ]);
  };

  const handleCollision = () => {
    if (vectorPairs.length >= 2) {
      hasCollision = Vector.hasCollisionWith(vectorPairs[0], vectorPairs[1]);
      return;
    }
    hasCollision = false;
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

  p.mousePressed = _ => {
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
        defaultYOffset
      )
      .attribute("disabled", "true")
      .mousePressed(revertSum);
    buttons.clearButton = p
      .createButton("clear")
      .position(
        defaultXOffset * 3 +
          buttons.revertSumButton.width +
          buttons.showSumButton.width,
        defaultYOffset
      )
      .mousePressed(() => {
        vectorPairs.splice(0, vectorPairs.length);
        hasCollision = false;
      });
  };

  p.draw = () => {
    p.background(180);

    p.translate(p.width / 2, p.height / 2).scale(1, -1);

    p.push();
    p.stroke("black").line(-1000, 0, 1000, 0);
    p.stroke("black").line(0, -1000, 0, 1000);
    p.pop();

    if (points.length === 4) {
      vectorPairs.push([
        new Vector([points[0], points[1]]),
        new Vector([points[2], points[3]])
      ]);
      points.splice(0, points.length);
    }
    if (points.length === 2) {
      p.push();
      p.stroke("black").line(
        points[0],
        points[1],
        p.mouseX - p.width / 2,
        (p.mouseY - p.height / 2) * -1
      );
      p.pop();
    }

    if (vectorPairs.length === 2)
      buttons.showSumButton.removeAttribute("disabled");
    if (vectorPairs.length !== 2)
      buttons.showSumButton.attribute("disabled", "true");
    if (vectorPairs.length === 3)
      buttons.revertSumButton.removeAttribute("disabled");
    if (vectorPairs.length !== 3)
      buttons.revertSumButton.attribute("disabled", "true");

    // p.push();
    // p.scale(1, -1);
    // p.textSize(15);
    // p.text(`Possui colisão? ${hasCollision}`, 0, 0);
    // p.pop();

    vectorPairs.forEach(pair => drawVector(p, pair[0], pair[1]));
  };
};

const myp5 = new p5(sketch, document.body);
