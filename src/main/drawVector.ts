import { Vector } from "@/domain/Vector";
import p5 from "p5";

export const drawVector = (p: p5, vector: Vector) => {
  p.push();
  p.translate(p.width / 2, p.height / 2)
    .scale(1, -1)
    .line(0, 0, vector.x, vector.y)
    .stroke("black");
  p.pop();
};
