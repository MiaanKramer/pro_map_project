import { OnInit, Input, NgZone, Directive, ElementRef, OnDestroy, ViewChild, inject, forwardRef } from '@angular/core';

import { MarkerManager } from './marker.service';
import { MapsApiLoader } from './maps-api-loader';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { viewParentEl } from '@angular/core/src/view/util';

declare var google: any;

export const MAP_MARKER_VALUE_ACCESSOR : any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MapMarkerDirective),
    multi: true
};

// https://blog.carbonfive.com/2015/03/25/communication-between-collaborating-directives-in-angular/

@Directive({
  selector: 'pv-map-marker',
  providers: [
    MAP_MARKER_VALUE_ACCESSOR
  ]
})
export class MapMarkerDirective implements OnInit, OnDestroy, ControlValueAccessor{

    private _marker: any;
    private _onChange = (value: any) => {};
    private _onTouch = () => {};

    static ANIMATION_DROP = 1;
    static ANIMATION_BOUNCE = 2;

    @Input()
    set animation(value: string){
        this.patchOptions({
            animation: this.getAnimation(value),
        });
    }

    private _markerOptions: any = {
        position: {
            lat: 0,
            lng: 0
        },
        draggable: true,
        visible: true
    };

    host: {
        (change): '_onChange($event.target.value)'
     }

    private _markerOptions$ = new BehaviorSubject(this._markerOptions);

    @Input()
    set markerTitle(value: string){
        this.patchOptions({
            title: value,
        });
    }

    set MarkerPos(value: {lat: number, lng: number}) {
        this.patchOptions({
            lat: value.lat,
            lng: value.lng
        })
    }

    constructor(
        private _mapsApiLoader: MapsApiLoader,
        private _markers: MarkerManager 
    ) {}

    writeValue(value: any): void {
        this.patchOptions({
            position: {
                lat: value.lat,
                lng: value.lng
            }
        });
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
       this._onTouch = fn;
    }

    change($event) {
        this._onChange($event.geometry.location);
    }

    ngOnInit() {
        // console.log('init marker');
        this._mapsApiLoader.load().then(() => {
            console.log('INIT MARKER');
            this.initMarker();
        });
    }

    initMarker(){
        this._marker = new google.maps.Marker(this._markerOptions$.value);
        this._markers.add(this._marker);

        this._marker.addListener('position_changed', () => {
            let pos = this._marker.getPosition();
            let latLng = {
                lat: pos.lat(),
                lng: pos.lng()
            };
            this._onChange(latLng);
        });

        this._marker.addListener('mouseup', (e) => {
            console.log("Lat: ", e.latLng.lat());
            console.log("Lng: ", e.latLng.lng());
        });

        this._markerOptions$.subscribe(options => {
            this._marker.setOptions(options);
        });

    }

    getAnimation(animation: 'drop' | 'bounce' | string){
        switch(animation){
            case 'drop':
                return 2;
            case 'bounce':
                return 1;
        }
        return null;
    }

    ngOnDestroy(){ }

    setMarkerOptions(options) {
        this._markerOptions.position.lat = options.position.lat;
        this._markerOptions.position.lng = options.position.lng;
    }

    private patchOptions(options: any){
        this._markerOptions$.next({
            ...this._markerOptions$.value,
            ...options
        });
    }

}