import { FileHelper } from './file-helper';
import { Folder } from './folder';
import { FolderType } from './folder-type.enum';
import { ZipReader, BlobReader, TextWriter, FileEntry } from '@zip.js/zip.js';
import * as Icons from '../../osmand-icons';
import { Point } from '../point';

export class KmlParser {
    async parse(file: File): Promise<Folder[]> {
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith('.kml')) {
            const content = await FileHelper.readAsText(file);
            return this.getFolders(content);
        } else if (fileName.endsWith('.kmz')) {
            const zipReader = new ZipReader(new BlobReader(file));
            const entries = await zipReader.getEntries();
            const entry = entries.find(e => e.filename === 'doc.kml') as FileEntry;
            if (entry?.getData) {
                const content = await entry.getData(new TextWriter());
                return this.getFolders(content)
            }
        }
        return Promise.resolve([]);
    }

    private getFolders(content: string): Folder[] {
        const xml = FileHelper.parseString(content);
        const document = xml.querySelector('kml > Document');
        if (!document) {
            return [];
        }
        const folders: Folder[] = [];
        const defaultName = this.getName(document);
        const documentFolders = document.querySelectorAll('Folder');
        if (documentFolders.length) {
            for (const folder of documentFolders) {
                this.processFolder(folder, folders, defaultName);
            }
        } else {
            this.processFolder(document, folders, defaultName);
        }
        return folders;
    }

    private processFolder(kmlFolder: Element, folders: Folder[], defaultName: string | undefined): void {
        const folderName = this.getName(kmlFolder) ?? defaultName;
        const folder = new Folder();
        folder.name = folderName;
        folders.push(folder);
        for (const kmlPlacemark of kmlFolder.querySelectorAll('Placemark')) {
            const placemarkName = this.getName(kmlPlacemark);
            const placemarkDescription = this.getDescription(kmlPlacemark);
            if (!this.tryAddPoint(kmlPlacemark, folder, placemarkName, placemarkDescription))
                this.tryAddPath(folder, folders, kmlPlacemark, placemarkName, placemarkDescription);
        }
    }

    private getName(element: Element): string | undefined {
        return this.getText(element, 'name');
    }

    private getDescription(element: Element): string | undefined {
        return this.getText(element, 'description');
    }

    private getText(element: Element, name: string): string | undefined {
        return element  .querySelector(name)?.textContent;
    }

    private tryAddPoint(element: Element, folder: Folder, name: string | undefined, description: string | undefined): boolean {
        const placemarkPoint = element.querySelector('Point');
        if (!placemarkPoint)
            return false;

        const color = this.getColor(element);
        const icon = this.getIcon(element) === 1769 ? Icons.Checkmark : Icons.Default;
        const coordinatesValue = element.querySelector('coordinates')?.textContent;
        if (!coordinatesValue) {
            return false;
        }
        const coordinates = coordinatesValue.trim().split(',');
        folder.points[0] ??= [];
        folder.points[0].push(
            {
                name,
                latitude: coordinates[1].trim(),
                longtitude: coordinates[0].trim(),
                description,
                color,
                icon
            });
        return true;
    }

    private tryAddPath(folder: Folder, folders: Folder[], kmlPlacemark: Element, placemarkName: string | undefined, placemarkDescription: string | undefined)
        : boolean {
        let segments = kmlPlacemark.querySelectorAll('LineString > coordinates') ||
            kmlPlacemark.querySelectorAll('Polygon > LinearRing > coordinates');
        if (!segments) {
            const polygon = kmlPlacemark.querySelector('MultiGeometry > Polygon');
            if (polygon) {
                segments = polygon.querySelectorAll('outerBoundaryIs > LinearRing > coordinates');
            }
        }
        if (!segments) {
            return false;
        }
        const pathColor = this.getColor(kmlPlacemark);
        const lineFolder = new Folder();
        lineFolder.name = `${folder.name} - ${placemarkName || placemarkDescription}`;
        lineFolder.type = FolderType.Path;
        lineFolder.color = pathColor;
        folders.push(lineFolder);
        for (const segmentElement of segments) {
            const segment = segmentElement.textContent;
            const points: Point[] = [];
            const lines = segment.trim().split(/[\n\r]/);
            for (const line of lines) {
                const coordinates = line.trim().split(',');
                points.push({ latitude: coordinates[1], longtitude: coordinates[0] })
            }
            lineFolder.points.push(points);
        }
        return true;
    }

    private getIcon(kmlPlacemark: Element): number | undefined {
        // google
        const styleUrl = kmlPlacemark.querySelector('styleUrl')?.textContent;
        if (styleUrl) {
            const iconId = /(?:\-)(\d{4,})(?:\-|$)/.exec(styleUrl);
            if (iconId) {
                return +iconId[1];
            }
        }
        return undefined;
    }

    private getColor(kmlPlacemark: Element): string | undefined {
        // google
        const styleUrl = kmlPlacemark.querySelector('styleUrl')?.textContent;
        if (styleUrl) {
            const color = /(?:\-)([ABCDEF\d]{6})(?:\-|$)/.exec(styleUrl);
            if (color) {
                return color[1];
            }
        }
        // yandex
        let rgb  = kmlPlacemark.querySelector('Style > IconStyle > color')?.textContent;
        if (rgb) {
            if (rgb.length > 6)
                rgb = rgb.substring(rgb.length - 6, 6);
            if (rgb.length == 6)
                rgb = rgb.substring(4, 2) + rgb.substring(2, 2) + rgb.substring(0, 2);
            return rgb;
        }
        return undefined;
    }
}
