import { OnInit, Input, NgZone, Directive, ElementRef, OnDestroy, ViewChild, inject, forwardRef } from '@angular/core';

import { MapMarkerManager } from './map-marker-manager';
import { MapsApiLoader } from '../maps-api-loader';
import { MapMarkerRef } from './map-marker-ref';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { LatLng } from '../types';

declare var google: any;

// https://blog.carbonfive.com/2015/03/25/communication-between-collaborating-directives-in-angular/

@Directive({
  selector: 'pv-map-info-window'
})
export class MapInfoWindowDirective implements OnInit, OnDestroy {

    private _defaultOptions: any = {};

    private _options$ = new BehaviorSubject<LatLng>(this._defaultOptions);
    private _infoWindow = null;

    constructor(
        private _mapsApiLoader: MapsApiLoader,
        private _markers: MapMarkerManager,
        private _markerRef: MapMarkerRef
    ) {}

    @Input()
    set content(value: any){
        this.patchOptions({ content: value });
    }

    @Input()
    set maxWidth(value: number){
        this.patchOptions({ maxWidth: value });
    }

    @Input()
    set marker(value: any){
        this.patchOptions({ marker: value });
    }

    @Input()
    set map(value: any){
        this.patchOptions({ map: value });
    }

    data;

    ngOnInit() {
        this._mapsApiLoader.load().then(() => {
            this.initInfoWindow(this.data);
        });
    }

    initInfoWindow(Data){
        this._infoWindow = new google.maps.InfoWindow({
            content: `
            <h1 mat-title>Title</h1>
            <mat-card-content>
                <mat-card-icon>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    <br>
                      Vestibulum dapibus auctor pretium. Donec sit amet velit
                    <br> 
                      sit amet ante accumsan tincidunt eget a lacus.</span>
                    <br>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    <br>
                      Vestibulum dapibus auctor pretium. Donec sit amet velit
                    <br> 
                      sit amet ante accumsan tincidunt eget a lacus.</span>
                    <br>
            </mat-card-content>
            <mat-card-actions>
                <Button mat-button>Info</Button>
            </mat-card-actions>
            `,
        });

        this._markerRef.open(this._infoWindow);
        this._markerRef.add(this._infoWindow);
    }

    ngOnDestroy(){ }

    patchOptions(options: any){
        let updated = { ...this._options$.value, ...options };
        this._options$.next(updated);
    }
}

// Lorem ipsum dolor amet try-hard venmo selvage, vape lyft knausgaard cred chia helvetica shoreditch post-ironic salvia. Synth lyft yuccie, kombucha chillwave drinking vinegar echo park activated charcoal everyday carry heirloom VHS hot chicken. Waistcoat tacos occupy church-key austin semiotics. Vinyl succulents put a bird on it readymade. Banh mi af asymmetrical ennui truffaut tattooed quinoa wolf fanny pack, woke direct trade. Flannel gastropub chia taxidermy shaman schlitz chillwave forage next level paleo succulents.

// Listicle PBR&B humblebrag taiyaki yuccie, migas heirloom poutine mixtape air plant. Iceland tofu XOXO thundercats DIY knausgaard yr messenger bag helvetica affogato live-edge roof party vaporware. Cray flannel marfa, coloring book lomo green juice mustache tbh farm-to-table. Shaman ramps man braid, kale chips messenger bag austin helvetica tote bag ethical. Prism offal roof party slow-carb ramps viral crucifix literally. You probably haven't heard of them iceland tote bag yuccie pinterest.

// Small batch post-ironic franzen truffaut williamsburg single-origin coffee gluten-free gentrify poutine hot chicken XOXO banjo chillwave whatever. Pickled lyft street art af man braid flannel gochujang taxidermy man bun deep v venmo cronut. Four loko brooklyn freegan narwhal, pitchfork chillwave air plant vaporware lumbersexual brunch leggings tacos photo booth hashtag. Mlkshk before they sold out vape chicharrones slow-carb.

// Mustache semiotics edison bulb butcher street art typewriter brooklyn occupy listicle +1 single-origin coffee lo-fi. Kickstarter gentrify activated charcoal kinfolk venmo meditation, hashtag tote bag humblebrag yuccie pickled swag direct trade. Fanny pack meggings raw denim beard kogi. Keytar trust fund banjo chicharrones. Occupy subway tile artisan chillwave truffaut, twee kinfolk hexagon forage. Sartorial pork belly lomo drinking vinegar sustainable cloud bread tattooed palo santo poke wolf wayfarers poutine mixtape.

// Umami austin stumptown 8-bit dreamcatcher. Locavore you probably haven't heard of them activated charcoal, food truck yuccie 90's semiotics bushwick scenester PBR&B gochujang quinoa. Organic banjo lo-fi cornhole, pug tbh forage pok pok migas. Vape tousled scenester, vice cold-pressed neutra tbh forage street art cloud bread raw denim tumblr.