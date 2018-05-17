import {Inject, Injectable } from '@angular/core';
import { DOCUMENT} from '@angular/common';


@Injectable()
export class MapsApiLoader {

    private _scriptLoadingPromise: Promise<void>;

    constructor(@Inject(DOCUMENT) private _document: Document) {}


    public load() : Promise<void>{

        if (this._scriptLoadingPromise) {
           return this._scriptLoadingPromise;
        }

        const script = <HTMLScriptElement> this._document.createElement('script');
        const callbackName = `callbackGoogleMapsApiLoader`;

        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;

        script.src = this._getScriptSrc('AIzaSyAcd7WNVyhDAJIeApHfTAK7S9MoYlU8F2w', callbackName);

        this._scriptLoadingPromise = new Promise<void>((resolve: Function, reject: Function) => {
            (window)[callbackName] = () => { resolve(); };

            script.onerror = (error: Event) => { reject(error); };
        });

        this._document.body.appendChild(script);
        return this._scriptLoadingPromise;
    }


    private _getScriptSrc(apiKey: string, callback: string){
        return `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callback}`;
    }



}