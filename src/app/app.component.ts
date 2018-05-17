import { Component } from '@angular/core';

import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  mapInfo:any = {};

  markerControl = new FormControl({ lat: 0, lng: 0});
  polygonControl = new FormControl(
    [
      { lat: 1, lng: -1},
      { lat: 1, lng: 1},
      { lat: -1, lng: 1},
      { lat: -1, lng: -1}
    ]
  );


  mouseMoved(event){
    // console.log(event);
    this.mapInfo.mouseCoords = event.latLng;
  }


}
