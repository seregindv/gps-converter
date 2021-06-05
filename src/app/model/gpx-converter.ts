import { ConverterBase } from './converter-base';

export class GpxConverter extends ConverterBase {
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
