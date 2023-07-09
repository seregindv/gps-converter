import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConverterBase } from '../model/converter-base';
import { PointParser } from '../model/parsers/point-parser';

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

  @ViewChild('downloadLink') downloadLink: ElementRef | undefined;

  fileName = '';

  converters: ConverterBase[];

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
}
