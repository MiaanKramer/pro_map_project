import { Component } from '@angular/core';

import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    showMap = true;

    searchValue = "";

    polysControl = new FormArray([
        new FormControl([
            { lat: 1, lng: -1 },
            { lat: 1, lng: 1 },
            { lat: -1, lng: 1 },
            { lat: -1, lng: -1 }
        ])
    ]);

    markersControl = new FormArray([
        new FormControl({ lat: 1, lng: -1 }),
        new FormControl({ lat: 45, lng: -35 })
    ]);

    mapInfo: any = {};
    marker = { lat: 1, lng: -1 };
    poly = [
        { lat: 1, lng: -1 },
        { lat: 1, lng: 1 },
        { lat: -1, lng: 1 },
        { lat: -1, lng: -1 }
    ];


    mouseMoved(event) {
        this.mapInfo.mouseCoords = event.latLng;
    }

    addMarker() {
        this.markersControl.push(new FormControl({ lat: 0, lng: 0 }));
    }

    removeMarker() {
        this.markersControl.removeAt(0);
    }



}
