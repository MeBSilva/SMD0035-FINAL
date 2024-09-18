import {
  getIdentityMatrix3,
  getNinetyDegreeRotationMatrixValues,
  getTranslationMatrix,
  Matrix3,
} from "./Matrix";

export abstract class Vector {
  public values: number[] = [];
  public color: [number, number, number];

  constructor(initialValues?: number[], color?: [number, number, number]) {
    if (initialValues) this.values.push(...initialValues);
    this.color = color ?? [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255,
    ];
  }

  public abstract plus(that: this): this;

  public minus(that: this): this {
    return this.plus(that.inverse());
  }

  public inverse(): this {
    return this.times(-1);
  }

  public abstract times(scalar: number): this;

  public dot(that: this): number {
    return this.values.reduce(
      (accumulator, value, index) => accumulator + value * that.values[index],
      0,
    );
  }

  public norm(): number {
    return Math.sqrt(
      this.values.reduce(
        (accumulator, value, index) =>
          index < 4 ? accumulator + value ** 2 : accumulator,
        0,
      ),
    );
  }

  public toUnitVector(): this {
    return this.times(1 / this.norm());
  }

  public isEqual(that: this): boolean {
    const cross = this.cross(that);
    return cross.values.every((value) => value === 0);
  }

  public abstract cross(that: this): this;

  public projection(that: this): this {
    return that.times(this.dot(that) / that.dot(that));
  }

  public slide(normal: this): this {
    return this.minus(normal.times(normal.dot(this)));
  }

  public reflect(normal: this): this {
    return this.minus(normal.times(2).times(normal.dot(this)));
  }
}

export class Vector3 extends Vector {
  get x() {
    return this.values[0];
  }
  get y() {
    return this.values[1];
  }
  get z() {
    return this.values[2];
  }
  get w() {
    return this.values[2];
  }

  constructor(
    initialValues?: [number, number, number],
    color?: [number, number, number],
  ) {
    super(initialValues ? [...initialValues, 1] : [0, 0, 0, 1], color);
  }

  public isNull() {
    return !this.x && !this.y && !this.z;
  }

  public plus(that: this): this {
    return new Vector3([
      this.x + that.x,
      this.y + that.y,
      this.z + that.z,
    ]) as this;
  }

  public times(scalar: number): this {
    return new Vector3([
      this.values[0] * scalar,
      this.values[1] * scalar,
      this.values[2] * scalar,
    ]) as this;
  }

  public cross(that: this): this {
    return new Vector3([
      this.y * that.z - this.z * that.y,
      this.z * that.x - this.x * that.z,
      this.x * that.y - this.y * that.x,
    ]) as this;
  }

  public projection(that: this): this {
    return that.times(this.dot(that) / that.dot(that));
  }

  public slide(normal: this): this {
    return this.minus(normal.times(normal.dot(this)));
  }

  public reflect(normal: this): this {
    return this.minus(normal.times(2).times(normal.dot(this)));
  }

  public translate(that: Vector3): Vector3 {
    const T = getTranslationMatrix(that.x, that.y, that.z);

    return T.dot(this) as this;
  }

  public scale(scalar: number): Vector3 {
    const S = getIdentityMatrix3();
    S.values[0][0] = scalar;
    S.values[1][1] = scalar;
    S.values[2][2] = scalar;

    return S.dot(this) as this;
  }

  public rotate90(): Vector3 {
    const rotationMatrix = getNinetyDegreeRotationMatrixValues();

    return rotationMatrix.dot(this);
  }

  public rotateMinus90(): Vector3 {
    const rotationMatrix = getNinetyDegreeRotationMatrixValues();
    rotationMatrix.values[1][0] = 1;
    rotationMatrix.values[0][1] = -1;

    return rotationMatrix.dot(this);
  }

  private getOctant() {
    if (this.x > 0 && this.y >= 0 && this.x > this.y) return "first";
    if (this.x > 0 && this.y > 0 && this.y >= this.x) return "second";
    if (this.x <= 0 && this.y > 0 && this.y > -this.x) return "third";
    if (this.x < 0 && this.y > 0 && -this.x >= this.y) return "fourth";
    if (this.x < 0 && this.y <= 0 && this.y > this.x) return "fifth";
    if (this.x < 0 && this.y < 0 && this.x >= this.y) return "sixth";
    if (this.x >= 0 && this.y < 0 && -this.y > this.x) return "seventh";
    if (this.x > 0 && this.y < 0 && this.x >= -this.y) return "eighth";
    throw new Error("invalid pair");
  }

  public findPseudoAngleWithXAxis(): number {
    if (this.isNull()) return 0;

    const octant = this.getOctant();

    switch (octant) {
      case "first": {
        const py = this.y / this.x;
        return +(py * (180 / Math.PI)).toFixed(2);
      }
      case "second": {
        const px = this.x / this.y;
        return +((2 - px) * (180 / Math.PI)).toFixed(2);
      }
      case "third": {
        const px = -this.x / this.y;
        return +((2 + px) * (180 / Math.PI)).toFixed(2);
      }
      case "fourth": {
        const py = this.y / -this.x;
        return +((4 - py) * (180 / Math.PI)).toFixed(2);
      }
      case "fifth": {
        const py = this.y / this.x;
        return +((4 + py) * (180 / Math.PI)).toFixed(2);
      }
      case "sixth": {
        const px = this.x / this.y;
        return +((6 - px) * (180 / Math.PI)).toFixed(2);
      }
      case "seventh": {
        const px = -this.x / this.y;
        return +((6 + px) * (180 / Math.PI)).toFixed(2);
      }
      case "eighth": {
        const py = this.y / -this.x;
        return +((8 - py) * (180 / Math.PI)).toFixed(2);
      }

      default:
        throw new Error("Invalid octant");
    }
  }
}
