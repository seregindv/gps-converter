import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConverterBase } from '../model/converter-base';
import { PointParser } from '../model/parsers/point-parser';
import { KmlParser } from '../model/parsers/kml/kml-parser';
import { GpxWriter } from '../model/parsers/kml/gpx-writer';
import { FileLink } from '../model/file-link';

@Component({
  selector: 'app-gps-converter',
  templateUrl: './gps-converter.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: ['.large { font-size: 20px }']
})
export class GpsConverterComponent {
  constructor(converters: ConverterBase, private _parsers: PointParser) {
    this.converters = converters as any as ConverterBase[];
  }

  @ViewChild('downloadLink') downloadLink!: ElementRef;
  @ViewChild('fileInput') fileInput!: HTMLInputElement;
  fileName = '';
  converters: ConverterBase[];
  fileLinks!: FileLink[];

  save(text: string, converter: ConverterBase): void {
    const lines = text.split('\n');
    const name = this.fileName && this.fileName[0] ? this.fileName : 'points';
    const xml = converter.getXml(name, lines);
    const file = new Blob([xml], { type: 'application/octet-stream' });
    if (!this.downloadLink) {
      return;
    }
    this.downloadLink.nativeElement.href = URL.createObjectURL(file);
    this.downloadLink.nativeElement.download = `${name}.${converter.getExtension()}`;
    this.downloadLink.nativeElement.click();
  }

  showInfo(): void {
    console.log(this.converters);
    alert(['Supported formats: '].concat((this._parsers as unknown as PointParser[]).map(p => '- ' + p.formatSample)).join('\n'));
  }

  async processInputFile(e: any) {
    const parser = new KmlParser();
    const folders = await parser.parse(e.target.files[0]);
    const writer = new GpxWriter();
    this.fileLinks = writer.getFiles(folders);
    this.fileInput.value = '';
  }
}
