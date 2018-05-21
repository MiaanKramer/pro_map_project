import { OnInit, Input, NgZone, Directive, ElementRef, OnDestroy, ViewChild, inject, forwardRef, Output, EventEmitter } from '@angular/core';

import { MapMarkerManager } from './map-marker-manager';
import { MapsApiLoader } from '../maps-api-loader';
import { MapMarkerRef } from './map-marker-ref';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { LatLng } from '../types';

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
    MAP_MARKER_VALUE_ACCESSOR,
    MapMarkerRef
  ]
})
export class MapMarkerDirective implements OnInit, OnDestroy, ControlValueAccessor{

    static ANIMATION_DROP = 1;
    static ANIMATION_BOUNCE = 2;

    @Input()
    set animation(value: any){
        this.patchOptions({ animation: value });
    }

    @Input()
    set editable(value: boolean){
        this.patchOptions({ editable: value });
    }

    @Input()
    set crossOnDrag(value: boolean){
        this.patchOptions({ crossOnDrag: value });
    }

    @Input()
    set cursor(value: any){
        this.patchOptions({ cursor: value });
    }

    @Input()
    set draggable(value: boolean){
        this.patchOptions({ draggable: value });
    }

    @Input()
    set icon(value: string){
        this.patchOptions({ icon: value });
    }

    @Input()
    set label(value: any){
        this.patchOptions({ label: value });
    }

    @Input()
    set opacity(value: number) {
        this.patchOptions({ opacity: value });
    }

    @Input()
    set title(value: string){
        this.patchOptions({ title: value });
    }

    @Input()
    set visible(value: boolean){
        this.patchOptions({ visible: value });
    }

    @Output('click')
    clickEmitter = new EventEmitter<MouseEvent>();

    private _defaultOptions: any = {
        draggable: true,
        visible: true
    };

    private _position$ = new BehaviorSubject<LatLng>({lat: 0, lng: 0});
    private _options$ = new BehaviorSubject<LatLng>(this._defaultOptions);
    private _marker: any;
    private _onChange = (value: any) => {};
    private _onTouch = () => {};

    constructor(
        private _mapsApiLoader: MapsApiLoader,
        private _markers: MapMarkerManager,
        private _markerRef: MapMarkerRef,
        private _zone: NgZone
    ) {}

    writeValue(value: any): void {
        this._position$.next(value);
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
       this._onTouch = fn;
    }

    ngOnInit() {
        this._mapsApiLoader.load().then(() => {
            this.initMarker();
        });
    }

    initMarker(){
        this._marker = new google.maps.Marker(this._defaultOptions);
        this._markers.add(this._marker);
        this._markerRef.use(this._marker, this._marker.getMap());

        this._marker.addListener('position_changed', () => {

            this._zone.run(() => {
                let pos = this._marker.getPosition();
                    let latLng = {
                        lat: pos.lat(),
                        lng: pos.lng()
                    };
                    this._onChange(latLng);
            });

        });

        this._marker.addListener('click', (event) => {
            this._zone.run(() => {
                this.clickEmitter.emit(event);
            });
        });

        this._position$.subscribe(pos => {
            this._zone.run(() => {
                this._marker.setPosition(pos);
            });
        });

        this._options$.subscribe(options => {
            this._zone.run(() => {
                this._marker.setOptions(options);
            });
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

    ngOnDestroy(){
        if(this._marker){
            this._markers.remove(this._marker);
        }
        this._position$.complete();
        this._options$.complete();
    }

    patchOptions(options: any){
        let updated = { ...this._options$.value, ...options };
        this._options$.next(updated);
    }


}