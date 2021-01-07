import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GpxConverter } from '../model/gpx-converter';

@Component({
  selector: 'app-gps-converter',
  templateUrl: './gps-converter.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GpsConverterComponent implements OnInit {
  constructor() { }

  private _parser: GpxConverter;

  @ViewChild('downloadLink') downloadLink: ElementRef;

  ngOnInit(): void {
  }

  fileName = '';

  onSaveGpxClick(text: string) {
    const lines = text.split('\n');
    const gpx = this.parser.getGpx(lines);
    var file = new Blob([gpx], { type: 'application/octet-stream' });
    this.downloadLink.nativeElement.href = URL.createObjectURL(file);
    this.downloadLink.nativeElement.download = `${this.fileName && this.fileName[0] ? this.fileName : 'points'}.gpx`;
    this.downloadLink.nativeElement.click();
  }

  private get parser(): GpxConverter {
    if (!this._parser) {
      this._parser = new GpxConverter();
    }
    return this._parser;
  }
}
