import { Injectable } from '@angular/core';

declare var google: any;


@Injectable()
export class MapMarkerRef {

    private _marker = null;
    private _map = null;

    public use(marker: any, map: any) {
        this._marker = marker;
        this._map = map;
    }

    public openInfoWindow(infoWindow: any) {
        infoWindow.open(this._map, this._marker);
    }

    public closeInfoWindow(infoWindow: any) {
        infoWindow.close();
    }

}