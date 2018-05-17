import { Injectable } from '@angular/core';
import { MapMarkerDirective } from './map-marker.directive';
import { PolygonManagerService } from './polygon.service';
import { AppComponent } from './app.component';

declare var google: any;


@Injectable()
export class MarkerManager {
    private _markers = [];
	private _map: any;
    private _marker: MapMarkerDirective;
    private _poly: PolygonManagerService;
    private _app : AppComponent;

    public useMap(map: any){
        this._map = map;
    }

    public add(marker: any){
        this._markers.push(marker);
        marker.setMap(this._map);
    }

    public remove(marker: any){
        marker.setMap(null);
        marker.unbindAll();
        this._markers.splice(this._markers.indexOf(marker), 1);
    }

    public get() {
        return this._markers;
    }
}