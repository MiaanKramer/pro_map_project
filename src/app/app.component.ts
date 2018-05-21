import { Component } from '@angular/core';

import { FormControl, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

    showMap = true;

    polysControl = new FormArray([
        new FormControl([
            { lat: 1, lng: -1},
            { lat: 1, lng: 1},
            { lat: -1, lng: 1},
            { lat: -1, lng: -1}
        ]),
        new FormControl([
            { lat: 2, lng: -2},
            { lat: 2, lng: 2},
            { lat: -2, lng: 2},
            { lat: -2, lng: -2}
        ]),
    ]);

    markersControl = new FormArray([
        new FormControl({ lat: 1, lng: -1}),
        new FormControl({ lat: 1, lng: 1}),
        new FormControl({ lat: -1, lng: 1}),
        new FormControl({ lat: -1, lng: -1})
    ]);


    mapInfo:any = {};
    marker = { lat: 1, lng: -1};
    poly = [
        { lat: 1, lng: -1},
        { lat: 1, lng: 1},
        { lat: -1, lng: 1},
        { lat: -1, lng: -1}
    ];


  mouseMoved(event){
    this.mapInfo.mouseCoords = event.latLng;
  }

  addMarker(){
      this.markersControl.push(new FormControl({lat: 0, lng: 0}));
  }

  removeMarker(){
      this.markersControl.removeAt(0);
  }

}
