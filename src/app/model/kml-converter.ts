import { Injectable } from '@angular/core';
import { ConverterBase } from './converter-base';
import { PointParser } from './parsers/point-parser';
import { XmlHelper } from './parsers/kml/xml-helper';

@Injectable()
export class KmlConverter extends ConverterBase {
    constructor(parsers: PointParser) { super(parsers); }

    getExtension(): string {
        return 'kml';
    }

    protected getContent(name: string, lines: string[]): string[] {
        const result: string[] = ['<kml xmlns="http://www.opengis.net/kml/2.2">',
            '<Document>',
            `<name>${XmlHelper.getSafeString(name)}</name>`];
        for (const line of lines) {
            const point = this.parse(line);
            if (point) {
                result.push('<Placemark>',
                    `<name>${XmlHelper.getSafeString(point.name)}</name>`,
                    '<Point>',
                    `<coordinates>${point.longtitude},${point.latitude}</coordinates>`,
                    '</Point>',
                    '</Placemark>');
            }
        }
        result.push('</Document>', '</kml>');
        return result;
    }

}
