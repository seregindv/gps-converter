import { ConverterBase } from './converter-base';

export class KmlConverter extends ConverterBase {
    getExtension(): string {
        return 'kml';
    }

    protected getContent(name: string, lines: string[]): string[] {
        const result: string[] = ['<kml xmlns="http://www.opengis.net/kml/2.2">',
            '<Document>',
            `<name>${name}</name>`];
        for (const line of lines) {
            const point = this.parse(line);
            if (point) {
                result.push('<Placemark>',
                    `<name>${point.name}</name>`,
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
