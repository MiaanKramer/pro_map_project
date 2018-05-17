import { OnInit, Input, NgZone, Directive, OnDestroy, ViewChild, inject, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { PolygonManagerService } from './polygon.service';
import { MapsApiLoader } from './maps-api-loader';

declare var google: any;

export const MAP_POLYGON_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => MapPolygonDirective),
	multi: true
}

@Directive({
	selector: 'pv-map-polygon',
	providers: [
		MAP_POLYGON_VALUE_ACCESSOR
	]
})
export class MapPolygonDirective implements OnInit, OnDestroy, ControlValueAccessor{

	private _polygon: any;
	private _onChange = (value: any)=>{};
	private _ontouch = ()=>{};

	private _polygonOptions: any = {
		paths: [
			{
				lat: -1,
				lng: 1
			},
			{
				lat: 1,
				lng: 1
			},
			{
				lat: 1,
				lng: -1
			},
			{
				lat: -1,
				lng: -1
			}
		],
		strokeColor: "green",
		strokeOpacity: 1,
		strokeWeight: 2,
		fillColor: "lightGreen",
		fillOpacity: .2,
		draggable: true,
		editable: true
	}

	private _polygonOptions$ = new BehaviorSubject(this._polygonOptions);


constructor(
	private _mapsApiLoader: MapsApiLoader,
	private _polygons: PolygonManagerService

) { }

	writeValue(value: any): void {
		this.patchOptions({
			paths: value.paths
		});
	}

	registerOnChange(fn: any): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this._ontouch = fn;
	}

	ngOnInit() {
		this._mapsApiLoader.load().then(() => {
			this.initPoly();
		});
	}

	host: {
		(change): '_onChange($event.target.value)'
	 }

	initPoly() {
		this._polygon = new google.maps.Polygon(this._polygonOptions$.value);
		this._polygons.add(this._polygon);

		this._polygon.addListener('mouseup', (e) => {
			let polys = this._polygon.getPaths().getArray();

			let area = google.maps.geometry.spherical.computeArea(this._polygon.getPath());

			area = area.toFixed(2);
			console.log("Area:", area + "m\u00B2");
			for (let i = 0; i < this._polygon.getPath().b.length; i++) {
				console.log("PathLat " + (i + 1) + ":", this._polygon.getPath().b[i].lat());
				console.log("PathLng " + (i + 1) + ":", this._polygon.getPath().b[i].lng());
			}

			let converted = polys.map(poly => {
				let pathArr = poly.getArray();
				return pathArr.map(path => {
					return {
						lat: path.lat(),
						lng: path.lng()
					};
				})
			});
			this._onChange(converted);

		});

		this._polygonOptions$.subscribe(options => {
			this._polygon.setOptions(options);
		});
	}

	ngOnDestroy() {

	}

	private patchOptions(options: any) {
		this._polygonOptions$.next({
			...this._polygonOptions$.value,
			...options
		})
	}

}
