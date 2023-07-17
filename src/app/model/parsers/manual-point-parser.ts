import { Point } from './point';
import { PointParser } from './point-parser';


export class ManualPointParser extends PointParser {
    createPoint(line: string): Point | null {
        const result = /(\-?\d+(?:,|\.)\d+)\s+(\-?\d+(?:,|\.)\d+)\s+(.+)/.exec(line);
        if (!result) {
            return null;
        }
        return new Point(parseFloat(result[2].replace(',', '.')), parseFloat(result[1].replace(',', '.')),
            result[3]);
    }
    get formatSample(): string {
        return '55.87719 38.78353 Soviet str.';
    }
}
