import { NamedEarthPoint } from './named-earth-point';
import { PointParser } from './point-parser';


export class WikimapiaPointParser extends PointParser {
    createPoint(line: string): NamedEarthPoint | null {
        const result = /[^\d]*(?<lat_deg>\d+).(?<lat_min>\d+).(?<lat_sec>\d+).(?<lat_dir>[NS])\s+(?<lon_deg>\d+).(?<lon_min>\d+).(?<lon_sec>\d+).(?<lon_dir>[WE])\s+(?<name>.+)/.exec(line);
        if (!result || !result.groups) {
            return null;
        }
        return NamedEarthPoint.fromDegMinSec(result.groups['lon_deg'], result.groups['lon_min'], result.groups['lon_sec'],
            result.groups['lat_deg'], result.groups['lat_min'], result.groups['lat_sec'],
            result.groups['name']);
    }
    get formatSample(): string {
        return '55°52\'48"N   38°46\'38"E MTB Skill Park';
    }
}
