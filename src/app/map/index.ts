import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapMarkerDirective } from './directives/map-marker.directive';
import { MapPolygonDirective } from './directives/map-polygon.directive';
import { MapInfoWindowDirective } from './directives/map-info-window.directive';
import { MapComponent } from './map.component';

import { CoordinatesPipe } from './pipes/coords.pipe';
import { MapsApiLoader } from './maps-api-loader';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CoordinatesPipe,
        MapComponent,
        MapMarkerDirective,
        MapPolygonDirective,
        MapInfoWindowDirective
    ],
    exports: [
        CoordinatesPipe,
        MapComponent,
        MapMarkerDirective,
        MapPolygonDirective,
        MapInfoWindowDirective
    ],
    providers: [
        MapsApiLoader
    ]
})
export class MapModule {
}