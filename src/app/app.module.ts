import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GpsConverterComponent } from './gps-converter/gps-converter.component';
import { FormsModule } from '@angular/forms';
import { AutotravelPointParser } from './model/parsers/autotravel-point-parser';
import { PointParser } from './model/parsers/point-parser';
import { CultTourizmPointParser } from './model/parsers/cult-tourizm-point-parser';
import { ManualPointParser } from './model/parsers/manual-point-parser';
import { WikimapiaPointParser } from './model/parsers/wikimapia-point-parser';
import { ConverterBase } from './model/converter-base';
import { GpxConverter } from './model/gpx-converter';
import { KmlConverter } from './model/kml-converter';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    GpsConverterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    { provide: PointParser, useClass: AutotravelPointParser, multi: true },
    { provide: PointParser, useClass: CultTourizmPointParser, multi: true },
    { provide: PointParser, useClass: ManualPointParser, multi: true },
    { provide: PointParser, useClass: WikimapiaPointParser, multi: true },

    { provide: ConverterBase, useClass: GpxConverter, multi: true },
    { provide: ConverterBase, useClass: KmlConverter, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
