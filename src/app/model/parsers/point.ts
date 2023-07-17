export class Point {
    constructor(public longtitude: string | number, public latitude: string | number, public name?: string) {
    }

    description?: string | undefined;
    color?: string | undefined;

    static fromDegMinSec(lonDeg: string, lonMin: string, lonSec: string,
        latDeg: string, latMin: string, latSec: string, name: string): Point {
        return new Point(Point.toDeg(lonDeg, lonMin, lonSec), Point.toDeg(latDeg, latMin, latSec), name);
    }

    private static toDeg(deg: string, min: string, sec: string): number {
        return parseFloat(deg) + parseFloat(min) / 60 + parseFloat(sec) / 3600;
    }
}
