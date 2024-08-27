export class Vector {
  private values: number[] = [];

  get x() {
    return this.values[0];
  }
  get y() {
    return this.values[1];
  }
  get z() {
    return this.values[2];
  }

  constructor(initialValues?: number[]) {
    if (initialValues) this.values.push(...initialValues);
  }

  private insert(value: number) {
    this.values.push(value);
  }

  private remove(index: number) {
    this.values.splice(index, 1);
  }

  public plus(that: Vector): Vector {
    if (this.values.length !== that.values.length) throw new Error();

    return new Vector(
      this.values.map((value, index) => value + that.values[index])
    );
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
}
