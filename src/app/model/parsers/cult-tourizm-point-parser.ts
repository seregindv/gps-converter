import { Point } from './point';
import { PointParser } from './point-parser';

export class CultTourizmPointParser extends PointParser {
    createPoint(line: string): Point | null {
        const result = /[NS]([\d\.]+)\s+[EW]([\d\.]+)\s+(.+)/.exec(line);
        if (!result) {
            return null;
        }
        return new Point(parseFloat(result[2]), parseFloat(result[1]), result[3].trimEnd());
    }
    get formatSample(): string {
        return 'N55.87719 E38.78353 Soviet str.';
    }
}
