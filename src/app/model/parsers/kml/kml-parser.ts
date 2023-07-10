import { FileHelper } from './file-helper';
import { Folder } from './folder';
import { FolderType } from './folder-type.enum';
import { ZipReader, BlobReader, TextWriter } from '@zip.js/zip.js';

export class KmlParser {
    async parse(file: Blob): Promise<Folder[]> {
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith('.kml')) {
            const content = await FileHelper.readAsText(file);
            return this.getFolders(content);
        } else if (fileName.endsWith('.kmz')) {
            const zipReader = new ZipReader(new BlobReader(file));
            const entries = await zipReader.getEntries();
            const entry = entries.find(e => e.filename === 'doc.kml');
            if (entry?.getData) {
                const content = await entry.getData(new TextWriter());
                return this.getFolders(content)
            }
        }
        return Promise.resolve([]);
    }

    private async getFolders(content: string): Promise<Folder[]> {
        const xml = await FileHelper.parseString(content);
        const document = xml.kml.Document[0];
        const folders: Folder[] = [];
        const defaultName = document.name[0];
        if (document.Folder) {
            for (const folder of document.Folder) {
                this.processFolder(folder, folders, defaultName);
            }
        } else {
            this.processFolder(document, folders, defaultName);
        }
        return folders;
    }

    private processFolder(kmlFolder: any, folders: Folder[], defaultName: string) {
        const folderName: string = (kmlFolder.name && kmlFolder.name[0]) ?? defaultName;
        const folder = new Folder();
        folder.name = folderName;
        folders.push(folder);
        for (const kmlPlacemark of kmlFolder.Placemark) {
            const placemarkName = kmlPlacemark.name[0];
            const placemarkDescription = kmlPlacemark.description && kmlPlacemark.description[0];
            if (!this.tryAddPoint(kmlPlacemark, folder, placemarkName, placemarkDescription))
                this.tryAddPath(folder, folders, kmlPlacemark, placemarkName, placemarkDescription);
        }
    }

    private tryAddPoint(element: any, folder: Folder, name: string, description: string): boolean {
        const placemarkPoint = element.Point && element.Point[0];
        if (!placemarkPoint)
            return false;

        const color = this.getColor(element);
        const coordinatesValue: string = placemarkPoint.coordinates && placemarkPoint.coordinates[0];
        const coordinates = coordinatesValue.trim().split(',');
        folder.points.push(
            {
                name,
                latitude: coordinates[1].trim(),
                longtitude: coordinates[0].trim(),
                description,
                color
            });
        return true;
    }

    private tryAddPath(folder: Folder, folders: Folder[], kmlPlacemark: any, placemarkName: string, placemarkDescription: string): boolean {
        var coordinatesString = this.getPropertyAtPath<string>(kmlPlacemark, e => e.LineString, e => e[0], e => e.coordinates, e => e[0]) ||
            this.getPropertyAtPath<string>(kmlPlacemark, e => e.LinearRing, e => e[0], e => e.coordinates, e => e[0]);
        if (!coordinatesString) {
            return false;
        }
        const pathColor = this.getColor(kmlPlacemark);
        const lineFolder = new Folder();
        lineFolder.name = `${folder.name} - ${placemarkName || placemarkDescription}`;
        lineFolder.type = FolderType.Path;
        lineFolder.color = pathColor;
        folders.push(lineFolder);
        const lines = coordinatesString.trim().split(/[\n\r]/);
        for (const line of lines) {
            const coordinates = line.trim().split(',');
            lineFolder.points.push({ latitude: coordinates[1], longtitude: coordinates[0] })
        }
        return true;
    }

    private getColor(kmlPlacemark: any): string | undefined {
        // google
        const styleUrl = kmlPlacemark.styleUrl && kmlPlacemark.styleUrl[0];
        if (styleUrl) {
            const color = /(?:\-)([ABCDEF\d]{6})(?:\-|$)/.exec(styleUrl);
            if (color) {
                return color[1];
            }
        }
        // yandex
        let rgb = this.getPropertyAtPath<string>(kmlPlacemark, e => e.Style, e => e[0], e => e.IconStyle, e => e[0], e => e.color, e => e[0]);
        if (rgb) {
            if (rgb.length > 6)
                rgb = rgb.substring(rgb.length - 6, 6);
            if (rgb.length == 6)
                rgb = rgb.substring(4, 2) + rgb.substring(2, 2) + rgb.substring(0, 2);
            return rgb;
        }
        return undefined;
    }

    private getPropertyAtPath<T>(xml: any, ...getElement: ((e: any) => any)[]): T {
        let result = xml;
        for (const getter of getElement) {
            result = getter(result);
            if (!result) {
                return result;
            }
        }
        return result;
    }
}
