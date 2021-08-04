import { NamedEarthPoint } from './named-earth-point';
import { PointParser } from './point-parser';

export class CultTourizmPointParser extends PointParser {
    createPoint(line: string): NamedEarthPoint {
        const result = /[NS]([\d\.]+)\s+[EW]([\d\.]+)\s+(.+)/.exec(line);
        if (!result) {
            return null;
        }
        return new NamedEarthPoint(parseFloat(result[2]), parseFloat(result[1]), result[3].trimEnd());
    }
    get formatSample(): string {
        return '55.87719 38.78353 ул. Советская';
    }
}
