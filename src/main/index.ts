import p5 from "p5";
import { drawVector } from "./drawVector";
import { Vector } from "@/domain/Vector";

const handleSum = (vectorPairs: [Vector, Vector][]) => {
  const deltaX = vectorPairs[0][1].x - vectorPairs[1][0].x;
  const deltaY = vectorPairs[0][1].y - vectorPairs[1][0].y;

  const delta = new Vector([deltaX, deltaY]);

  vectorPairs[1] = [
    vectorPairs[1][0].translate(delta),
    vectorPairs[1][1].translate(delta)
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

const sketch = (p: p5) => {
  let vec1: Vector;
  let vec2: Vector;

  const vectorPairs: [Vector, Vector][] = [];
  const points: number[] = [];

  p.mousePressed = _ => {
    if (p.mouseButton === p.LEFT) {
      points.push(p.mouseX - p.width / 2, (p.mouseY - p.height / 2) * -1);
    }
  };

  p.setup = () => {
    p.frameRate(60);

    p.createCanvas(p.windowWidth, p.windowHeight);

    vec1 = new Vector([100, 200]);
    vec2 = new Vector([1000, 0]);
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

    // if (vectorPairs.length === 2) handleSum(vectorPairs);

    p.push();
    p.scale(1, -1);
    p.textSize(15);
    p.text(
      `Possui colisão? ${vectorPairs.length >= 2 ? Vector.hasCollisionWith(vectorPairs[0], vectorPairs[1]) : false}`,
      0,
      0
    );
    p.pop();

    vectorPairs.forEach(pair => drawVector(p, pair[0], pair[1]));
  };
};

const myp5 = new p5(sketch, document.body);
