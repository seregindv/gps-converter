import { Point } from './point';
import { PointParser } from './point-parser';


export class AutotravelPointParser extends PointParser {
    createPoint(line: string): Point | null {
        const result = /[NS]\s*(\d+)\D+([\d\.]+)\D?[\s,]+[EW]\s*(\d+)\D+([\d\.]+)\D?[\s]+(.+)/.exec(line);
        if (!result) {
            return null;
        }
        return Point.fromDegMinSec(result[3], result[4], '0', result[1], result[2], '0', result[5].trimEnd());
    }
    get formatSample(): string {
        return 'N056 44.668, E037 11.621 JINR Museum';
    }
}
