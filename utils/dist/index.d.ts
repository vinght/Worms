declare namespace UTILS {
    class Pos {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        clone(): Pos;
        equals(pos: Pos, diff?: number): boolean;
        round(n: number): void;
    }
    class VecPos {
        pos: Pos;
        r: number;
        constructor(x?: number, y?: number, r?: number);
        clone(): VecPos;
        add(radius: number): VecPos;
    }
    class Circle {
        pos: Pos;
        r: number;
        d: number;
        tr: number;
        constructor(x: number, y: number, r: number, d: number, tr: number);
    }
    function def<T>(value: T, defValue: T): T;
}
declare namespace Matthew {
    const PI: number;
    const H_PI: number;
    const D_PI: number;
    const normalize: (r: number) => number;
    const abs: (v: number) => number;
}
