import { AutotravelPointParser } from './parsers/autotravel-point-parser';
import { CultTourizmPointParser } from './parsers/cult-tourizm-point-parser';
import { ManualPointParser } from './parsers/manual-point-parser';
import { NamedEarthPoint } from './parsers/named-earth-point';
import { WikimapiaPointParser } from './parsers/wikimapia-point-parser';

export abstract class ConverterBase {
    private static parsers = [new WikimapiaPointParser(),
    new ManualPointParser(),
    new AutotravelPointParser(),
    new CultTourizmPointParser()];

    abstract getExtension(): string;

    protected abstract getContent(name: string, lines: string[]): string[];

    getXml(name: string, lines: string[]): string {
        return '<?xml version="1.0" encoding="utf-8"?>'.concat(...this.getContent(name, lines));
    }

    protected parse(line: string): NamedEarthPoint {
        for (const parser of ConverterBase.parsers) {
            const point = parser.createPoint(line);
            if (point) {
                return point;
            }
        }
        return null;
    }
}
