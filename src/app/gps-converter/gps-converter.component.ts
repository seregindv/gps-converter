import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConverterBase } from '../model/converter-base';
import { GpxConverter } from '../model/gpx-converter';
import { KmlConverter } from '../model/kml-converter';

@Component({
  selector: 'app-gps-converter',
  templateUrl: './gps-converter.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: ['.large { font-size: 20px }']
})
export class GpsConverterComponent {
  constructor() { }

  @ViewChild('downloadLink') downloadLink: ElementRef;

  fileName = '';

  saveGpx(text: string): void {
    this.save(text, new GpxConverter());
  }

  saveKml(text: string): void {
    this.save(text, new KmlConverter());
  }

  private save(text: string, converter: ConverterBase): void {
    const lines = text.split('\n');
    const name = this.fileName && this.fileName[0] ? this.fileName : 'points';
    const xml = converter.getXml(name, lines);
    const file = new Blob([xml], { type: 'application/octet-stream' });
    this.downloadLink.nativeElement.href = URL.createObjectURL(file);
    this.downloadLink.nativeElement.download = `${name}.${converter.getExtension()}`;
    this.downloadLink.nativeElement.click();
  }
}
