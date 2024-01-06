import { FileLink } from "../../file-link";
import { Folder } from "./folder";
import { FolderType } from "./folder-type.enum";
import { Point } from "../point";
import { XmlHelper } from "./xml-helper";

export class GpxWriter {
    getFiles(folders: Folder[]): FileLink[] {
        return folders.map(folder => ({
            address: URL.createObjectURL(new Blob(this.getFile(folder), { type: 'application/octet-stream' })),
            name: folder.name!,
            fileName: folder.name + '.gpx'
        }));
    }

    pushPoint(result: string[], point: Point) {
        result.push(`<wpt lat="${point.latitude}" lon="${point.longtitude}">`,
            `<name>${XmlHelper.getSafeString(point.name)}</name>`);
        this.pushExtensions(point, result);
        if (point.description) {
            result.push(`<desc>${XmlHelper.getSafeString(point.description)}</desc>`);
        }
        result.push('</wpt>');
    }

    getGpxHeader() {
        return '<gpx xmlns:osmand="https://osmand.net">';
    }

    private getFile(folder: Folder): string[] {
        return folder.type === FolderType.Path ? this.getPath(folder) : this.getPoints(folder.points);
    }

    private getPath(folder: Folder) {
        const result = this.getHeader();
        result.push('<trk>');
        this.pushExtensions(folder, result);
        result.push('<trkseg>');
        for (const point of folder.points) {
            result.push(`<trkpt lon="${point.longtitude}" lat="${point.latitude}" />`)
        }
        result.push('</trkseg>', '</trk>', '</gpx>');
        return result;
    }

    private getPoints(points: Point[]) {
        const result: string[] = this.getHeader();
        for (const point of points) {
            this.pushPoint(result, point);
        }
        result.push('</gpx>');
        return result;
    }

    private pushExtensions(extensible: Point | Folder, result: string[]) {
        const point = extensible as Point;
        if (extensible.color || point.icon) {
            result.push('<extensions>')
            if (extensible.color) {
                result.push(`<color>#${point.color}</color>`);
            }
            if (point.icon) {
                result.push(`<osmand:icon>${point.icon}</osmand:icon>`);
            }
            result.push('</extensions>');
        }
    }

    private getHeader() {
        return ['<?xml version="1.0" encoding="utf-8"?>', this.getGpxHeader()];
    }
}
