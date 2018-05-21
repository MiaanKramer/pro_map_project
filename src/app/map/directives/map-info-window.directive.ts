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

    private _content$ = new BehaviorSubject<string>('');
    private _options$ = new BehaviorSubject<LatLng>(this._defaultOptions);
    private _open$ = new BehaviorSubject<boolean>(true);
    private _infoWindow = null;

    constructor(
        private _mapsApiLoader: MapsApiLoader,
        private _markers: MapMarkerManager,
        private _markerRef: MapMarkerRef
    ) {}


    @Input()
    set content(value: any){
        this.patchOptions({ content: value.value });
    }

    @Input()
    set maxWidth(value: any){
        this.patchOptions({ maxWidth: value });
    }

    @Input()
    set open(value: boolean){
        this._open$.next(value);
    }

    ngOnInit() {
        this._mapsApiLoader.load().then(() => {
            this.initInfoWindow();
        });
    }

    initInfoWindow(){
        this._infoWindow = new google.maps.InfoWindow({});

        this._content$.subscribe(content => {
            this._infoWindow.setContent(content);
        })

        this._options$.subscribe(options => {
            this._infoWindow.setOptions(options);
        })

        this._open$.subscribe(open => {
            if(open){
                this._markerRef.openInfoWindow(this._infoWindow);
            }else{
                this._markerRef.closeInfoWindow(this._infoWindow);
            }
        });
    }

    ngOnDestroy(){
        if(this._infoWindow){
            this._markerRef.closeInfoWindow(this._infoWindow);
        }
        // complete behavior subjects
        this._content$.complete();
        this._options$.complete();
        this._open$.complete();
    }

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