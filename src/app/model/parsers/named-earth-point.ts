import { EarthPoint } from './earth-point';


export class NamedEarthPoint extends EarthPoint {
    constructor(longtitude: number, latitude: number, public name: string) {
        super(longtitude, latitude);
    }

    static fromDegMinSec(lonDeg: string, lonMin: string, lonSec: string,
                         latDeg: string, latMin: string, latSec: string, name: string): NamedEarthPoint {
        return new NamedEarthPoint(NamedEarthPoint.toDeg(lonDeg, lonMin, lonSec), NamedEarthPoint.toDeg(latDeg, latMin, latSec), name);
    }

    private static toDeg(deg: string, min: string, sec: string): number {
        return parseFloat(deg) + parseFloat(min) / 60 + parseFloat(sec) / 3600;
    }
}
