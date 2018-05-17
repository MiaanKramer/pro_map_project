import { Injectable } from '@angular/core';
import { MapPolygonDirective } from './map-polygon.directive';

@Injectable({
  providedIn: 'root'
})
export class PolygonManagerService {

  constructor() { }

  private _polygons = [];
	private _map: any;

    public useMap(map: any){
        this._map = map;
    }

    public add(polygon: any){
        this._polygons.push(polygon);
        polygon.setMap(this._map);
    }

    public remove(polygon: any){
        polygon.setMap(null);
        polygon.unbindAll();
        this._polygons.splice(this._polygons.indexOf(polygon), 1);
    }
}
