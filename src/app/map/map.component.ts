import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Input, NgZone, OnDestroy, Injectable } from '@angular/core';

import { MarkerManager } from '../marker.service';

import { MapsApiLoader } from '../maps-api-loader';
import { FormControl, NgControl, SelectControlValueAccessor } from '@angular/forms';
import { MapMarkerDirective, MAP_MARKER_VALUE_ACCESSOR} from '../map-marker.directive';
import { MapPolygonDirective } from '../map-polygon.directive';
import { PolygonManagerService } from '../polygon.service';
import {HttpClient} from '@angular/common/http';

import { Observable } from 'rxjs';
import { debounceTime, switchMap, map, filter } from 'rxjs/operators';

import {  } from '';

declare var google: any;

@Component({
    selector: 'pv-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    providers: [ MarkerManager ]
})

export class MapComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('mapHolder') mapHolder: ElementRef;
    @ViewChild('pv-map-marker') MapMarkerDirective: ElementRef;
    @ViewChild('pv-map-polygon') MapPolygonDirective: ElementRef;


    showError = false;
    showLoading = false;
    showMap = false;

    currentTool: string = null;

    mapInfo = {
        center: {
            lat: 0,
            lng: 0
        },
        cursorPos: {
            lat: 0,
            lng: 0
        },
        zoom: 1
    };

    marker = {
        position: {
            lat: 0,
            lng: 0
        }
    }

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

    private _mapListeners = [];

    @Input() set center(value: { lat: number, lng: number }){
        console.log('set center', value);
        this.mapInfo.center = value;
        this._mapOptions.center.lat = +value.lat;
        this._mapOptions.center.lng = +value.lng;
        if (this._map) this._map.setCenter(this._mapOptions.center);
        else console.log('map not ready for update');
    }
    
    @Input() set zoom(value: number){
        this._mapOptions.zoom = +value;
        if (this._map) this._map.setZoom(this._mapOptions.zoom);
    }

    @Input() set markerPos(value: {lat: number, lng: number}) {
        this.marker.position = value;
    }

    searchTerm = new FormControl('');
	searhResults: Observable<any[]>;
    apiKey = "AIzaSyABS__Tpc5IuYRGTbkFYL_0d1E1uMgRhp0";
    
    constructor(
        private _mapsApiLoader: MapsApiLoader,
        private _markers: MarkerManager,
        private _ngZone: NgZone,
        private _polygons: PolygonManagerService,
        private _http: HttpClient
    ) {
    }
    
    ngOnInit() {
        this._mapsApiLoader.load().then(
            () => {
                this.initMap();
            }
        ).catch(
            (err) => {
                console.error(err);
                this.showError = true;
            }
        );
        this.searhResults = 
            this.searchTerm.valueChanges
            .pipe(
                debounceTime(500),
                filter(term => {
                    return term.length > 2;
                }),
                switchMap(term => {
                    return this._http.get<any>('https://maps.googleapis.com/maps/api/geocode/json?address=' + term + '&key=' + this.apiKey)
                }),
                map(result => {
                    return result.results;
                })
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
                this.mapInfo.cursorPos.lat = e.latLng.lat();
                this.mapInfo.cursorPos.lng = e.latLng.lng();
            });
        }));
        this._mapListeners.push(this._map.addListener('zoom_changed', (e) => {
            this._ngZone.run(() => {
                this.mapInfo.zoom = this._map.getZoom();
            });
        }));
        this._mapListeners.push(this._map.addListener('click', (e) => {
            this._ngZone.run(() => {
                let marker = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                }
                this.markerPos = marker;
            });
        }));
        this.mapInfo.zoom = this._map.getZoom();
    }

    selectTool(tool: string){
        switch (tool){
            case 'add':
            break;
            case 'edit':
            break;
        }
        this.currentTool = tool;
    }
}