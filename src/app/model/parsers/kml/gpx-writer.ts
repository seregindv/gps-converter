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
        this.pushColor(point, result);
        if (point.description) {
            result.push(`<desc>${XmlHelper.getSafeString(point.description)}</desc>`);
        }
        result.push('</wpt>');
    }

    private getFile(folder: Folder): string[] {
        return folder.type === FolderType.Path ? this.getPath(folder) : this.getPoints(folder.points);
    }

    private getPath(folder: Folder) {
        const result = this.getHeader();
        result.push('<trk>');
        this.pushColor(folder, result);
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

    private pushColor(colored: Point | Folder, result: string[]) {
        if (colored.color) {
            result.push(`<extensions><color>#${colored.color}</color></extensions>`);
        }
    }

    private getHeader() {
        return ['<?xml version="1.0" encoding="utf-8"?>', '<gpx>'];
    }
}
