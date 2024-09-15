import {
  getTranslationMatrix,
  Matrix,
  NinetyDegreeRotationMatrix
} from "./Matrix";

export class Vector {
  public values: number[] = [];
  public color: [number, number, number];

  get x() {
    return this.values[0] ?? 0;
  }
  get y() {
    return this.values[1] ?? 0;
  }
  get z() {
    return this.values[2] ?? 0;
  }

  constructor(initialValues?: number[]) {
    if (initialValues) this.values.push(...initialValues);
    this.color = [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    ];
  }

  public plus(that: Vector): Vector {
    return new Vector([this.x + that.x, this.y + that.y, this.z + that.z]);
  }

  public minus(that: Vector): Vector {
    return this.plus(that.inverse());
  }

  public inverse(): Vector {
    return this.times(-1);
  }

  public times(scalar: number): Vector {
    return new Vector(this.values.map(value => value * scalar));
  }

  public dot(that: Vector): number {
    return this.values.reduce(
      (accumulator, value, index) => accumulator + value * that.values[index],
      0
    );
  }

  private norm(): number {
    return Math.sqrt(
      this.values.reduce((accumulator, value) => accumulator + value ** 2, 0)
    );
  }

  public toUnitVector(): Vector {
    return this.times(1 / this.norm());
  }

  public isEqual(that: Vector): boolean {
    const cross = this.cross(that);
    return cross.x === 0 && cross.y === 0 && cross.z === 0;
  }

  public cross(that: Vector): Vector {
    return new Vector([
      this.y * that.z - this.z * that.y,
      this.z * that.x - this.x * that.z,
      this.x * that.y - this.y * that.x
    ]);
  }

  public projection(that: Vector): Vector {
    return that.times(this.dot(that) / that.dot(that));
  }

  public slide(normal: Vector): Vector {
    return this.minus(normal.times(normal.dot(this)));
  }

  public reflect(normal: Vector): Vector {
    return this.minus(normal.times(2).times(normal.dot(this)));
  }

  public toHomogeneousCoordinates(): Vector {
    return new Vector(
      Array.from(
        Array(4),
        (_, index) => this.values[index] ?? (index !== 3 ? 0 : 1)
      )
    );
  }

  public translate(that: Vector): Vector {
    const T = getTranslationMatrix(that.x, that.y, that.z);

    return T.dot(this);
  }

  public rotate90(): Vector {
    const rotationMatrix = NinetyDegreeRotationMatrix;

    return rotationMatrix.dot(this);
  }

  public static hasCollisionWith(
    AB: [Vector, Vector],
    CD: [Vector, Vector]
  ): boolean {
    const a = AB[0].x > AB[1].x ? AB[1] : AB[0];
    const c = CD[0].x > CD[1].x ? CD[1] : CD[0];

    const deltaA = new Vector([0 - a.x, 0 - a.y]);

    const ab = (AB[0].y > AB[1].y ? AB[0] : AB[1]).translate(deltaA);
    const ac = (CD[0].x > CD[1].x ? CD[1] : CD[0]).translate(deltaA);
    const ad = (CD[0].x > CD[1].x ? CD[0] : CD[1]).translate(deltaA);

    const ABxAC = ab.cross(ac);
    const ABxAD = ab.cross(ad);

    if ((ABxAC.z >= 0 && ABxAD.z >= 0) || (ABxAC.z < 0 && ABxAD.z < 0))
      return false;

    const deltaC = new Vector([0 - c.x, 0 - c.y]);

    const cd = (CD[0].x > CD[1].x ? CD[0] : CD[1]).translate(deltaC);
    const ca = (AB[0].x > AB[1].x ? AB[1] : AB[0]).translate(deltaC);
    const cb = (AB[0].x > AB[1].x ? AB[0] : AB[1]).translate(deltaC);

    const CDxCA = cd.cross(ca);
    const CDxCB = cd.cross(cb);

    if ((CDxCA.z >= 0 && CDxCB.z >= 0) || (CDxCA.z < 0 && CDxCB.z < 0))
      return false;

    return true;
  }

  public tangent(): Vector {
    return this.rotate90().toUnitVector();
  }
}
