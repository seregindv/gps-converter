import { Injectable } from '@angular/core';
import { ConverterBase } from './converter-base';
import { PointParser } from './parsers/point-parser';
import { GpxWriter } from './parsers/kml/gpx-writer';

@Injectable()
export class GpxConverter extends ConverterBase {
    constructor(parsers: PointParser) { super(parsers); }

    getExtension(): string {
        return 'gpx';
    }

    getContent(name: string, lines: string[]): string[] {
        const gpxWriter = new GpxWriter();
        const result = [gpxWriter.getGpxHeader()];
        for (const line of lines) {
            const point = this.parse(line);
            if (point) {
                gpxWriter.pushPoint(result, point);
            }
        }
        result.push('</gpx>');
        return result;
    }
}
