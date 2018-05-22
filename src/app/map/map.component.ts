import { AfterViewInit, Component, Input, NgZone, OnDestroy, OnInit, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MapMarkerManager } from './directives/map-marker-manager';
import { MapPolygonManager } from './directives/map-polygon-manager';
import { MapsApiLoader } from './maps-api-loader';
import { LatLng } from './types';
import { FormControl } from '@angular/forms';

declare var google: any;

@Component({
    selector: 'pv-map',
    template: `
        <div class="map-holder" #mapHolder></div>
        <span>Zoom: {{ _zoom$ | async }}</span>
        <span>Center: {{ _center$ | async | json }}</span>
    `,
    providers: [
        MapMarkerManager,
        MapPolygonManager
    ],
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('mapHolder')
    private mapHolder: ElementRef;

    private _map: any;
    
    @Input()
    set center(value: LatLng ){
        this._center$.next(value);
    }
    
    @Input()
    set zoom(value: number){
        this._zoom$.next(value);
    }
    
    @Input()
    set zoomControl(value: boolean){
        this._zoomControl$.next(value);
    }
    
    @Input()
    set mapTypeControl(value: boolean){
        this._mapTypeControl$.next(value);
    }
    
    @Input()
    set scaleControl(value: boolean){
        this._scaleControl$.next(value);
    }
    
    @Input()
    set streetViewControl(value: boolean){
        this._streetViewControl$.next(value);
    }
    
    @Input()
    set rotateControl(value: boolean){
        this._rotateControl$.next(value);
    }
    
    @Input()
    set fullscreenControl(value: boolean){
        this._fullscreenControl$.next(value);
    }
    
    @Input()
    set gestureHandeling(value: string){
        this._gestureHandeling$.next(value);
    }
    
    @Input()
    set mapTypeId(value: string){
        this._mapTypeId$.next(value);
    }
    
    @Input()
    set draggableCursor(value: boolean){
        this._draggabelCursor$.next(value);
    }
    
    @Output('move')
    moveEmitter = new EventEmitter<MouseEvent>();

    private _defaultOptions = {
        center: {lat: -37.13, lng: -16.43},
        zoom: 2,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true,
        gestureHandling: 'greedy',
        mapTypeId: 'terrain', // roadmap satellite hybrid terrain
        draggableCursor: true
    };
    
    private _zoom$ = new BehaviorSubject<number>(10);
    private _zoomControl$ = new BehaviorSubject<boolean>(true);
    private _center$ = new BehaviorSubject<LatLng>({lat: 0, lng: 0});
    private _options$ = new BehaviorSubject<any>(this._defaultOptions);
    private _mapTypeControl$ = new BehaviorSubject<boolean>(true);
    private _scaleControl$ = new BehaviorSubject<boolean>(true);
    private _streetViewControl$ = new BehaviorSubject<boolean>(false);
    private _rotateControl$ = new BehaviorSubject<boolean>(true);
    private _fullscreenControl$ = new BehaviorSubject<boolean>(true);
    private _gestureHandeling$ = new BehaviorSubject<string>('greedy');
    private _mapTypeId$ = new BehaviorSubject<string>('terrain');
    private _draggabelCursor$ = new BehaviorSubject<boolean>(true);

    private randomMarkerAmount;
    private _mapListeners = [];
    
    constructor(
        private _mapsApiLoader: MapsApiLoader,
        private _markers: MapMarkerManager,
        private _polygons: MapPolygonManager,
        private _ngZone: NgZone,
        private _elementRef: ElementRef
    ) {}
    
    ngOnInit() {
        this._mapsApiLoader.load().then(
            () => {
                this.initMap();
            }
        ).catch(
            (err) => {
                console.log("ERROR Loading Map");
            }
        );
    }

    ngAfterViewInit(){}

    ngOnDestroy(){
        this._map.unbindAll();

        this._markers.clear();
        this._polygons.clear();

        this._zoom$.complete();
        this._center$.complete();
        this._options$.complete();
        this._mapTypeControl$.complete();
        this._scaleControl$.complete();
        this._streetViewControl$.complete();
        this._rotateControl$.complete();
        this._fullscreenControl$.complete();
        this._gestureHandeling$.complete();
        this._mapTypeId$.complete();
        this._draggabelCursor$.complete();

        // complete behavior subjects
    }

    selectLocation(pos) {
        this._map.setCenter(pos.geometry.location);
        this._map.setZoom(16);
    }

    initMap(){
        this._map = new google.maps.Map(this.mapHolder.nativeElement, this._defaultOptions);
        this._markers.useMap(this._map);
        this._polygons.useMap(this._map);

        this._mapListeners.push(this._map.addListener('mousemove', (e) => {
            this._ngZone.run(() => {
                this.moveEmitter.emit(e);
            });
        }));

        this._zoom$.subscribe(level => {
            this._map.setZoom(level);
        });

        this._center$.subscribe(latLng => {
            this._map.setCenter(latLng);
        });

    }

}