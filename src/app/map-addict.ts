import {LAYER_NAME, MapsWrapper} from "./maps/maps.wrapper";
import * as Leaflet from 'leaflet';
import {AfterViewInit, OnInit} from "@angular/core";
import {DomUtil, latLng, LayerGroup} from "leaflet";
import {LatLng} from "leaflet";
import {LatLngLiteral} from "leaflet";
import {LatLngTuple} from "leaflet";
import {Marker} from "leaflet";
import {LatLngExpression} from "leaflet";
import {GeoCoordinates} from "./ontologies/DataStructures";
import {HeatLayer} from "./maps/heat.layer";
import hasClass = DomUtil.hasClass;

export class MapAddict implements OnInit, AfterViewInit  {

  private _wrapper: MapsWrapper;

  private _map: Leaflet.Map;
  private _layers: Leaflet.LayerGroup;
  private _index: number[];

  private _user_defined: Leaflet.FeatureGroup;
  private _fetched: Leaflet.FeatureGroup;
  // private _area_selected: Leaflet.FeatureGroup;
  private _geometry: Leaflet.FeatureGroup;
  private _route_path: Leaflet.FeatureGroup;
  private _heat_group: Leaflet.FeatureGroup;

  protected init (mapWrapper: MapsWrapper) {

      this._wrapper = mapWrapper;

      this._map = this._wrapper.map;
      this._layers = this._wrapper.layers;
      this._index = this._wrapper.index;

      this._user_defined = this._wrapper.featureGroup(LAYER_NAME.USER_DEFINED);
      this._fetched = this._wrapper.featureGroup(LAYER_NAME.FETCHED);
      // this._area_selected = this._wrapper.featureGroup(LAYER_NAME.AREA_SELECTED);
      this._geometry = this._wrapper.featureGroup(LAYER_NAME.GEOMETRY);
      this._route_path = this._wrapper.featureGroup(LAYER_NAME.ROUTE_PATH);
      this._heat_group = this._wrapper.featureGroup(LAYER_NAME.HEAT_MAP);
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  get wrapper(): MapsWrapper { return this._wrapper; }

  get map(): Leaflet.Map { return this._map; }

  get layers(): Leaflet.LayerGroup { return this._layers; }

  get index(): number[] { return this._index; }

  get user_defined(): Leaflet.FeatureGroup { return this._user_defined; }

  get fetched(): Leaflet.FeatureGroup { return this._fetched; }

  // get area_selected(): Leaflet.FeatureGroup { return this._area_selected; }

  get geometry(): Leaflet.FeatureGroup { return this._geometry; }

  get route_path(): Leaflet.FeatureGroup { return this._route_path; }

  get heat_group(): Leaflet.FeatureGroup { return this._heat_group; }

  protected populateLayer(latLngs: LatLngExpression[],
                          group: LayerGroup,
                          markerGenerator: (LatLngExpression) => Marker) {

    group.clearLayers();

    latLngs.forEach(p => markerGenerator(p).addTo(group));
  }

  protected toLatLng(c: GeoCoordinates) : LatLng{
    return latLng([c.lat, c.lng]);
  }

}
