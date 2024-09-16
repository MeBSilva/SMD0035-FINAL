import { Vector, Vector3 } from "@/domain/Vector";

export class Matrix3 {
  public values: number[][] = [];

  constructor(initialValues?: number[][]) {
    if (initialValues) this.values.push(...initialValues);
  }

  public dot(that: Vector3): Vector3 {
    // const vectorValues = that.toHomogeneousCoordinates().values;
    const resultingValues: number[] = [];

    for (let i = 0; i < this.values.length; i++) {
      const rowValues: number[] = [];
      for (let j = 0; j < this.values.length; j++) {
        const element = this.values[j][i];

        rowValues.push(element * that.values[j]);
      }
      resultingValues.push(
        rowValues.reduce((accumulator, value) => accumulator + value, 0),
      );
    }

    return new Vector3([
      resultingValues[0],
      resultingValues[1],
      resultingValues[2],
    ]);
  }
}

const identityMatrixValues = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

export const getNinetyDegreeRotationMatrixValues = (): Matrix3 => {
  const altered = JSON.parse(JSON.stringify(identityMatrixValues));
  altered[0][0] = 0;
  altered[0][1] = 1;
  altered[1][0] = -1;
  altered[1][1] = 0;

  return new Matrix3(altered);
};

export const getIdentityMatrix3 = (): Matrix3 =>
  new Matrix3(JSON.parse(JSON.stringify(identityMatrixValues)));

export const getTranslationMatrix = (
  deltaX: number,
  deltaY: number,
  deltaZ: number,
): Matrix3 => {
  const altered = JSON.parse(JSON.stringify(identityMatrixValues));
  altered[3][0] = deltaX;
  altered[3][1] = deltaY;
  altered[3][2] = deltaZ;

  return new Matrix3(altered);
};
