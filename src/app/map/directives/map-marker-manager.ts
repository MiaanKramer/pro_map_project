import { Injectable } from '@angular/core';

declare var google: any;


@Injectable()
export class MapMarkerManager {
    private _markers = [];
	private _map: any;

    public useMap(map: any){
        this._map = map;
    }

    public add(marker: any){
        console.log('MapMarkerManager: add');
        this._markers.push(marker);
        marker.setMap(this._map);
    }

    public remove(marker: any){
        console.log('MapMarkerManager: remove');
        marker.unbindAll();
        marker.setMap(null);
        this._markers.splice(this._markers.indexOf(marker), 1);
    }

    public get(){
        return this._markers;
    }

    public clear(){
        console.log('MapMarkerManager: clear', this._markers.length);
        this._markers.forEach(marker => {
            marker.unbindAll();
            marker.setMap(null);
        });
        this._markers = [];
    }
}