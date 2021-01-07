import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GpsConverterComponent } from './gps-converter/gps-converter.component';

const routes: Routes = [{ path: '', component: GpsConverterComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
