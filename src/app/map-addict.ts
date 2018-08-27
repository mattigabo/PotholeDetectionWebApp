
import {LAYER_NAME, MapsWrapper} from "./maps/maps.wrapper";
import * as Leaflet from 'leaflet';
import {AfterViewInit, OnInit} from "@angular/core";

export class MapAddict implements OnInit, AfterViewInit  {

  protected _wrapper: MapsWrapper;

  protected _map: Leaflet.Map;
  protected _layers: Leaflet.LayerGroup;
  protected _index: number[];

  protected _user_defined: Leaflet.FeatureGroup;
  protected _fetched: Leaflet.FeatureGroup;
  protected _area_selected: Leaflet.FeatureGroup;
  protected _geometry: Leaflet.FeatureGroup;

  protected init (mapWrapper: MapsWrapper) {

      this._wrapper = mapWrapper;

      this._map = this._wrapper.map;
      this._layers = this._wrapper.layers;
      this._index = this._wrapper.index;

      this._user_defined = this._wrapper.layer(LAYER_NAME.USER_DEFINED);
      this._fetched = this._wrapper.layer(LAYER_NAME.FETCHED);
      this._area_selected = this._wrapper.layer(LAYER_NAME.AREA_SELECTED);
      this._geometry = this._wrapper.layer(LAYER_NAME.GEOMETRY);

  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }
}
