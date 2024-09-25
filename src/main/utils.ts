import type { Segment3 } from "@/domain/Segment";

import type p5 from "p5";

const isMouseHittingNav = ({
  p,
  defaultXOffset,
  defaultYOffset,
}: {
  p: p5;
  defaultXOffset: number;
  defaultYOffset: number;
}) => {
  if (
    p.mouseX >= defaultXOffset &&
    p.mouseX <= p.width - defaultXOffset &&
    p.mouseY >= defaultYOffset &&
    p.mouseY <= 3 * defaultYOffset
  )
    return true;

  return false;
};

export type AppState = "angles" | "vectors" | "particles" | "volumes";
export type VolumeSelectionMode = "create point" | "select volume";

export const handleMousePress = ({
  p,
  segments,
  defaultXOffset,
  defaultYOffset,
  state,
}: {
  p: p5;
  segments: Segment3[];
  defaultXOffset: number;
  defaultYOffset: number;
  state: AppState;
}): number[] => {
  if (
    p.mouseButton === p.LEFT &&
    !isMouseHittingNav({ defaultXOffset, defaultYOffset, p }) &&
    (segments.length < 2 || state === "particles" || state === "volumes")
  )
    return [p.mouseX - p.width / 2, (p.mouseY - p.height / 2) * -1];
  return [];
};
