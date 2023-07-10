import { FileLink } from "../../file-link";
import { Folder } from "./folder";
import { FolderType } from "./folder-type.enum";
import { Point } from "./point";

export class GpxWriter {
    getFiles(folders: Folder[]): FileLink[] {
        return folders.map(folder => ({
            address: URL.createObjectURL(new Blob([this.getFile(folder).join('\n')], { type: 'application/octet-stream' })),
            name: folder.name!,
            fileName: folder.name + '.gpx'
        }));
    }

    private getFile(folder: Folder): string[] {
        return folder.type === FolderType.Points ? this.getPoints(folder) : this.getPath(folder);
    }

    private getPath(folder: Folder) {
        const result = this.getHeader();
        result.push('<trk>');
        this.addColor(folder, result);
        result.push('<trkseg>');
        for (const point of folder.points) {
            result.push(`<trkpt lon="${point.longtitude}" lat="${point.latitude}" />`)
        }
        result.push('</trkseg>', '</trk>', '</gpx>');
        return result;
    }

    private getPoints(folder: Folder) {
        const result: string[] = this.getHeader();
        for (const point of folder.points) {
            result.push(`<wpt lat="${point.latitude}" lon="${point.longtitude}">`,
                `<name>${point.name}</name>`);
            this.addColor(point, result);
            if (point.description) {
                result.push(`<desc>${point.description}</desc>`);
            }
            result.push('</wpt>');
        }
        result.push('</gpx>');
        return result;
    }

    private addColor(colored: Point | Folder, result: string[]) {
        if (colored.color) {
            result.push(`<extensions><color>#${colored.color}</color></extensions>`);
        }
    }

    private getHeader() {
        return ['<?xml version="1.0" encoding="utf-8"?>', '<gpx>'];
    }
}
