import { AfterViewInit, Component, Input, NgZone, OnDestroy, OnInit, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MapMarkerManager } from './directives/map-marker-manager';
import { MapPolygonManager } from './directives/map-polygon-manager';
import { MapsApiLoader } from './maps-api-loader';
import { LatLng } from './types';

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

    private _mapOptions = {
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
        draggableCursor: ''
    };

    @Input() set center(value: LatLng ){
        this._center$.next(value);
    }

    @Input() set zoom(value: string){
        this._zoom$.next(parseInt(value));
    }

    @Output('move')
    moveEmitter = new EventEmitter<MouseEvent>();

    private _zoom$ = new BehaviorSubject<number>(10);
    private _center$ = new BehaviorSubject<LatLng>({lat: 0, lng: 0});

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

            }
        );

    }

    ngAfterViewInit(){}

    ngOnDestroy(){
        this._mapListeners.forEach(listener => {
            listener.remove();
        });
    }

    selectLocation(pos) {
        this._map.setCenter(pos.geometry.location);
        this._map.setZoom(16);
    }

    initMap(){
        this._map = new google.maps.Map(this.mapHolder.nativeElement, this._mapOptions);
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