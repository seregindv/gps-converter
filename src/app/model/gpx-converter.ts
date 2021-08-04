import { Injectable } from '@angular/core';
import { ConverterBase } from './converter-base';
import { PointParser } from './parsers/point-parser';

@Injectable()
export class GpxConverter extends ConverterBase {
    constructor(parsers: PointParser) { super(parsers); }

    getExtension(): string {
        return 'gpx';
    }

    getContent(name: string, lines: string[]): string[] {
        const result: string[] = ['<gpx>'];
        for (const line of lines) {
            const point = this.parse(line);
            if (point) {
                result.push(`<wpt lat="${point.latitude}" lon="${point.longtitude}">`,
                    `<name>${point.name}</name>`,
                    '</wpt>');
            }
        }
        result.push('</gpx>');
        return result;
    }
}
