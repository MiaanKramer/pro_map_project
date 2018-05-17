import { NgModule } from '@angular/core';
import 'hammerjs';

import { BrowserModule }  from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms'

import {
	MatButtonModule,
	MatIconModule,
	MatToolbarModule
} from '@angular/material';

import { MapModule } from './map';
import { AppComponent } from './app.component';

@NgModule({
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		BrowserAnimationsModule,
		HttpClientModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule,
		MapModule
	],

    declarations: [
		AppComponent
	],

    exports: [],

	providers: [],

	bootstrap: [
		AppComponent
	]

})
export class AppModule { }
