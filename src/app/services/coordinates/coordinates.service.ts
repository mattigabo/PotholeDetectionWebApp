import { Injectable } from '@angular/core';
import * as Leaflet from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class CoordinatesService {

  public static ACTIONS = {
    REGISTER: "REGISTER",
    DISPLAY: "DISPLAY",
    HIDE: "HIDE",
    HIDE_ALL: "HIDE_ALL"
  };

  private _coordinates: Leaflet.LatLng;

  constructor() {
    this._coordinates = new Leaflet.LatLng(0.0, 0.0, 0.0);
  }

  get coordinates(): Leaflet.LatLng {
    return this._coordinates;
  }

  set coordinates(value: Leaflet.LatLng) {
    this._coordinates = value;
  }
}
