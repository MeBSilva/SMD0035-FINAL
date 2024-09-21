import type p5 from "p5";

export const setupCartesian = (p: p5) => {
  p.background(180);

  p.translate(p.width / 2, p.height / 2).scale(1, -1);
};
