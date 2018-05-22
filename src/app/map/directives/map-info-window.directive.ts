import { OnInit, Input, NgZone, Directive, ElementRef, OnDestroy, ViewChild, inject, forwardRef } from '@angular/core';

import { MapMarkerManager } from './map-marker-manager';
import { MapsApiLoader } from '../maps-api-loader';
import { MapMarkerRef } from './map-marker-ref';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { LatLng } from '../types';

declare var google: any;

@Directive({
    selector: 'pv-map-info-window'
})
export class MapInfoWindowDirective implements OnInit, OnDestroy {

    private _defaultOptions: any = {
        maxWidth: 250,
        content: 'Default Content'
    };

    private _content$ = new BehaviorSubject<string>('');
    private _options$ = new BehaviorSubject<LatLng>(this._defaultOptions);
    private _open$ = new BehaviorSubject<boolean>(true);
    private _infoWindow = null;

    constructor(
        private _mapsApiLoader: MapsApiLoader,
        private _markers: MapMarkerManager,
        private _markerRef: MapMarkerRef
    ) { }


    @Input()
    set content(value: any) {
        this.patchOptions({ content: value });
    }

    @Input()
    set maxWidth(value: number) {
        this.patchOptions({ maxWidth: value });
    }

    @Input()
    set open(value: boolean) {
        this._open$.next(value);
        this.toggle(value);
    }

    ngOnInit() {
        this._mapsApiLoader.load().then(() => {
            this.initInfoWindow();
        });
    }

    initInfoWindow() {
        this._infoWindow = new google.maps.InfoWindow({});

        this._content$.subscribe(content => {
            this._infoWindow.setContent(content);
        })

        this._options$.subscribe(options => {
            this._infoWindow.setOptions(options);
        })

        this._open$.subscribe(open => {
            if (open) {
                this._markerRef.openInfoWindow(this._infoWindow);
            } else {
                this._markerRef.closeInfoWindow(this._infoWindow);
            }
        });
    }


    ngOnDestroy() {
        if (this._infoWindow) {
            this._markerRef.closeInfoWindow(this._infoWindow);
        }
        this._content$.complete();
        this._options$.complete();
        this._open$.complete();
    }

    patchOptions(options: any) {
        let updated = { ...this._options$.value, ...options };
        this._options$.next(updated);
    }

    toggle(value) {
        if (value) {
            this._infoWindow.close();
        } else {
            this._infoWindow.open();
        }
    }
}