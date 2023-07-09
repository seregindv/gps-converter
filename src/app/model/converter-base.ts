import { NamedEarthPoint } from './parsers/named-earth-point';
import { PointParser } from './parsers/point-parser';

export abstract class ConverterBase {
    constructor(parsers: PointParser) {
        this._parsers = parsers as unknown as PointParser[];
    }

    private _parsers: PointParser[];

    abstract getExtension(): string;

    protected abstract getContent(name: string, lines: string[]): string[];

    getXml(name: string, lines: string[]): string {
        return '<?xml version="1.0" encoding="utf-8"?>'.concat(...this.getContent(name, lines));
    }

    protected parse(line: string): NamedEarthPoint | null {
        for (const parser of this._parsers) {
            const point = parser.createPoint(line);
            if (point) {
                return point;
            }
        }
        return null;
    }
}
