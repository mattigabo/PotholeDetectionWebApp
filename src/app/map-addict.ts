
import {LAYER_NAME, MapsWrapper} from "./maps/maps.wrapper";
import * as Leaflet from 'leaflet';
import {AfterViewInit, OnInit} from "@angular/core";
import {LatLngExpression, LatLngLiteral} from "leaflet";
import {LngLat} from "./ontologies/RouteData";

export class MapAddict implements OnInit, AfterViewInit  {

  protected _wrapper: MapsWrapper;

  protected _map: Leaflet.Map;
  protected _layers: Leaflet.LayerGroup;
  protected _index: number[];

  protected _user_defined: Leaflet.FeatureGroup;
  protected _fetched: Leaflet.FeatureGroup;
  protected _area_selected: Leaflet.FeatureGroup;
  protected _geometry: Leaflet.FeatureGroup;
  protected _route_path: Leaflet.FeatureGroup;

  protected init (mapWrapper: MapsWrapper) {

      this._wrapper = mapWrapper;

      this._map = this._wrapper.map;
      this._layers = this._wrapper.layers;
      this._index = this._wrapper.index;

      this._user_defined = this._wrapper.layer(LAYER_NAME.USER_DEFINED);
      this._fetched = this._wrapper.layer(LAYER_NAME.FETCHED);
      this._area_selected = this._wrapper.layer(LAYER_NAME.AREA_SELECTED);
      this._geometry = this._wrapper.layer(LAYER_NAME.GEOMETRY);
      this._route_path = this._wrapper.layer(LAYER_NAME.ROUTE_PATH);

  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  public drawRoutePath(lngLats: LngLat[]){
    console.log(lngLats);
    var latLngs: LatLngLiteral[] = [];
    lngLats.forEach((value: LngLat) => {
      var formatCorrected: LatLngLiteral = { lat: value[1], lng: value[0] }
      latLngs.push(formatCorrected);
    });
    var polyline = Leaflet.polyline(latLngs, {color: 'red'});
    polyline.addTo(this._route_path);
    // zoom the map to the polyline
    this._map.fitBounds(polyline.getBounds());
  }
}
