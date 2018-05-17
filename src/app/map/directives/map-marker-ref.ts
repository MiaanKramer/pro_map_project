import { Injectable } from '@angular/core';

declare var google: any;


@Injectable()
export class MapMarkerRef {

    private _marker = null;
    private _map = null;

    use(marker: any, map: any){
        this._marker = marker;
        this._map = map;
    }

    open(infoWindow: any){
        return infoWindow.open(this._map, this._marker);
    }

}