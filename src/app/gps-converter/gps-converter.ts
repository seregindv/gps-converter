import { Component, ElementRef, inject, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConverterBase } from '../model/converter-base';
import { PointParser } from '../model/parsers/point-parser';
import { GpxWriter } from '../model/parsers/kml/gpx-writer';
import { FileLink } from '../model/file-link';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gps-converter',
  templateUrl: './gps-converter.html',
  encapsulation: ViewEncapsulation.None,
  styles: ['.large { font-size: 20px }'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class GpsConverterComponent {
  @ViewChild('downloadLink') downloadLink!: ElementRef;
  @ViewChild('fileInput') fileInput!: HTMLInputElement;
  fileName = '';
  fileLinks = signal<FileLink[] | null>(null);
  converters = inject(ConverterBase) as any as ConverterBase[];

  private _parsers = inject(PointParser) as any as PointParser[];

  save(text: string, converter: ConverterBase): void {
    const lines = text.split('\n');
    const name = this.fileName && this.fileName[0] ? this.fileName : 'points';
    const xml = converter.getXml(name, lines);
    const file = new Blob(xml, { type: 'application/octet-stream' });
    if (!this.downloadLink) {
      return;
    }
    this.downloadLink.nativeElement.href = URL.createObjectURL(file);
    this.downloadLink.nativeElement.download = `${name}.${converter.getExtension()}`;
    this.downloadLink.nativeElement.click();
  }

  showInfo(): void {
    console.log(this.converters);
    alert(['Supported formats: '].concat(this._parsers.map(p => '- ' + p.formatSample)).join('\n'));
  }

  async processInputFile(e: any) {
    const kml = await import('../model/parsers/kml/kml-parser');
    const parser = new kml.KmlParser();
    const folders = await parser.parse(e.target.files[0]);
    const writer = new GpxWriter();
    this.fileLinks.set(writer.getFiles(folders));
    this.fileInput.value = '';
  }
}
