import { Injectable } from '@angular/core';

declare var google: any;


@Injectable()
export class MapMarkerRef {

    private _marker = null;
    private _map = null;
    private _windows = [];

    public use(marker: any, map: any){
        this._marker = marker;
        this._map = map;
    }

    public open(infoWindow: any){
        return infoWindow.open(this._map, this._marker);
    }

    public add(infoWindow: any){
        this._windows.push(infoWindow);
    }

    public remove(infowWindow: any){
        infowWindow.setMarker(null);
        infowWindow.unbindAll();
        this._windows.splice(this._windows.indexOf(infowWindow), 1);
    }

    public clear() {
        this._windows.forEach(win => {
            this.remove(win);
        });
    }

    public get(){
        return this._windows;
    }

}