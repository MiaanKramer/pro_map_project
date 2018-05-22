import { NgModule, Pipe } from '@angular/core';
import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'

import {
	MatButtonModule,
	MatIconModule,
	MatToolbarModule,
	MatInputModule,
	MatFormFieldModule,
	MatAutocompleteModule
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
		MapModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule,
		MatInputModule,
		MatAutocompleteModule
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
