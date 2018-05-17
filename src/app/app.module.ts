import { NgModule } from '@angular/core';

import { MapsApiLoader } from './maps-api-loader';

import { FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms'

import { MapComponent } from './map/map.component';
import { MapMarkerDirective } from './map-marker.directive';
import { CoordinatesPipe } from './coords.pipe';

import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MapPolygonDirective } from './map-polygon.directive';

import { HttpClientModule } from '@angular/common/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		BrowserAnimationsModule,
		HttpClientModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
	],
	
    declarations: [
        MapComponent,
        MapMarkerDirective,
		CoordinatesPipe,
		AppComponent,
		MapPolygonDirective

	],
	
    exports: [
        MapComponent,
        MapMarkerDirective,
        CoordinatesPipe
	],
	
	providers: [ 
		MapsApiLoader
	],

	bootstrap: [AppComponent]
	
})
export class AppModule { }

export * from './maps-api-loader';
export * from './marker.service';