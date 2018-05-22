import { Injectable } from '@angular/core';

@Injectable()
export class MapPolygonManager {

    constructor() { }

    private _polygons = [];
    private _map: any;

    public useMap(map: any) {
        console.log('MapPolygonManager: useMap');
        this._map = map;
    }

    public add(polygon: any) {
        console.log('MapPolygonManager: add');
        this._polygons.push(polygon);
        polygon.setMap(this._map);
    }

    public remove(polygon: any) {
        console.log('MapPolygonManager: remove');
        polygon.unbindAll();
        polygon.setMap(null);
        this._polygons.splice(this._polygons.indexOf(polygon), 1);
    }

    public clear() {
        console.log('MapPolygonManager: clear');
        this._polygons.forEach(polygon => {
            polygon.unbindAll();
            polygon.setMap(null);
        });
        this._polygons = [];
    }
}

