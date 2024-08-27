import p5 from "p5";
import { drawVector } from "./drawVector";
import { Vector } from "@/domain/Vector";

const sketch = (p: p5) => {
  let vec1: Vector;
  let vec2: Vector;

  p.setup = () => {
    p.frameRate(60);

    p.createCanvas(p.windowWidth, p.windowHeight);

    vec1 = new Vector([100, 200]);
    vec2 = new Vector([1000, 0]);
  };

  p.draw = () => {
    p.background(180);

    // drawVector(p, vec1);
    drawVector(p, vec1);

    p.push();
    p.translate(p.width / 2, p.height / 2).scale(1, -1);
    p.line(100, -1000, 100, 1000).stroke("black");
    p.pop();

    drawVector(p, vec1.reflect(new Vector([-1, 0])));
    // drawVector(p, vec1.projection(vec2));
  };
};

const myp5 = new p5(sketch, document.body);
