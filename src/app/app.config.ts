import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { GpsConverterComponent } from './gps-converter/gps-converter';
import { PointParser } from './model/parsers/point-parser';
import { AutotravelPointParser } from './model/parsers/autotravel-point-parser';
import { CultTourizmPointParser } from './model/parsers/cult-tourizm-point-parser';
import { ManualPointParser } from './model/parsers/manual-point-parser';
import { WikimapiaPointParser } from './model/parsers/wikimapia-point-parser';
import { ConverterBase } from './model/converter-base';
import { GpxConverter } from './model/gpx-converter';
import { KmlConverter } from './model/kml-converter';

const routes : Routes = [{ path: '', component: GpsConverterComponent }];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    { provide: PointParser, useClass: AutotravelPointParser, multi: true },
    { provide: PointParser, useClass: CultTourizmPointParser, multi: true },
    { provide: PointParser, useClass: ManualPointParser, multi: true },
    { provide: PointParser, useClass: WikimapiaPointParser, multi: true },

    { provide: ConverterBase, useClass: GpxConverter, multi: true },
    { provide: ConverterBase, useClass: KmlConverter, multi: true }
  ]
};
