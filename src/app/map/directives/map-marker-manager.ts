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
        this._markers.push(marker);
        marker.setMap(this._map);
    }

    public remove(marker: any){
        marker.setMap(null);
        marker.unbindAll();
        this._markers.splice(this._markers.indexOf(marker), 1);
    }

    public get(){
        return this._markers;
    }

    public clear(){
        this._markers.forEach(mark => {
            this.remove(mark);
        });
    }
}