import { Vector } from "@/domain/Vector";

export class Matrix {
  private values: number[][] = [];

  constructor(initialValues?: number[][]) {
    if (initialValues) this.values.push(...initialValues);
  }

  public dot(that: Vector): Vector {
    const vectorValues = that.toHomogeneousCoordinates().values;
    const resultingValues: number[] = [];

    for (let i = 0; i < this.values.length; i++) {
      const rowValues: number[] = [];
      for (let j = 0; j < this.values.length; j++) {
        const element = this.values[j][i];

        rowValues.push(element * vectorValues[j]);
      }
      resultingValues.push(
        rowValues.reduce((accumulator, value) => accumulator + value, 0),
      );
    }

    return new Vector(resultingValues);
  }
}

const identityMatrixValues = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

const getNinetyDegreeRotationMatrixValues = () => {
  const altered = JSON.parse(JSON.stringify(identityMatrixValues));
  altered[0][0] = 0;
  altered[0][1] = 1;
  altered[1][0] = -1;
  altered[1][1] = 0;

  return altered;
};

export const NinetyDegreeRotationMatrix = new Matrix(
  getNinetyDegreeRotationMatrixValues(),
);

export const getTranslationMatrix = (
  deltaX: number,
  deltaY: number,
  deltaZ: number,
): Matrix => {
  const altered = JSON.parse(JSON.stringify(identityMatrixValues));
  altered[3][0] = deltaX;
  altered[3][1] = deltaY;
  altered[3][2] = deltaZ;

  return new Matrix(altered);
};
