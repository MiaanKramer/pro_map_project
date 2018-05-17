import { OnInit, Input, NgZone, Directive, ElementRef, OnDestroy, ViewChild, inject, forwardRef } from '@angular/core';

import { MapMarkerManager } from './map-marker-manager';
import { MapsApiLoader } from '../maps-api-loader';
import { MapMarkerRef } from './map-marker-ref';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { LatLng } from '../types';

declare var google: any;

// https://blog.carbonfive.com/2015/03/25/communication-between-collaborating-directives-in-angular/

@Directive({
  selector: 'pv-map-info-window'
})
export class MapInfoWindowDirective implements OnInit, OnDestroy {

    private _defaultOptions: any = {};

    private _options$ = new BehaviorSubject<LatLng>(this._defaultOptions);
    private _infoWindow = null;

    constructor(
        private _mapsApiLoader: MapsApiLoader,
        private _markers: MapMarkerManager,
        private _markerRef: MapMarkerRef
    ) {}

    ngOnInit() {
        this._mapsApiLoader.load().then(() => {
            this.initInfoWindow();
        });
    }

    initInfoWindow(){
        this._infoWindow = new google.maps.InfoWindow({
            content: 'test',
        });

        this._markerRef.open(this._infoWindow);
    }

    ngOnDestroy(){ }

    patchOptions(options: any){
        let updated = { ...this._options$.value, ...options };
        this._options$.next(updated);
    }


}