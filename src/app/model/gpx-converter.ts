import { AutotravelPointParser } from "./parsers/autotravel-point-parser";
import { CultTourizmPointParser } from "./parsers/cult-tourizm-point-parser";
import { ManualPointParser } from "./parsers/manual-point-parser";
import { NamedEarthPoint } from "./parsers/named-earth-point";
import { WikimapiaPointParser } from "./parsers/wikimapia-point-parser";

export class GpxConverter {
    private parsers = [new WikimapiaPointParser(),
    new ManualPointParser(),
    new AutotravelPointParser(),
    new CultTourizmPointParser()];

    getGpx(lines: string[]): string {
        const result: string[] = ['<gpx>'];
        for (const line of lines) {
            const point = this.parse(line);
            if (point) {
                result.push(`<wpt lat="${point.latitude}" lon="${point.longtitude}">`);
                result.push(`<name>${point.name}</name>`);
                result.push('</wpt>')
            }
        }
        result.push('</gpx>');
        return '<?xml version="1.0" encoding="utf-8"?>'.concat(...result);
    }

    private parse(line: string): NamedEarthPoint {
        for (const parser of this.parsers) {
            const point = parser.createPoint(line);
            if (point) {
                return point;
            }
        }
        return null;
    }
}
