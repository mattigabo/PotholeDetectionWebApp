import {LAYER_NAME, MapsWrapper} from "./maps.wrapper";
import * as Leaflet from 'leaflet';
import {DomUtil, latLng, LatLng, LatLngExpression, LayerGroup, Marker} from 'leaflet';
import {AfterViewInit, OnInit} from "@angular/core";
import {GeoCoordinates} from "../ontologies/DataStructures";

export class MapAddict implements OnInit, AfterViewInit {

  private _wrapper: MapsWrapper;

  private _map: Leaflet.Map;
  private _layers: Leaflet.LayerGroup;
  private _index: number[];

  private _user_defined: Leaflet.FeatureGroup;
  private _system_defined: Leaflet.FeatureGroup;
  private _fetched: Leaflet.FeatureGroup;
  // private _area_selected: Leaflet.FeatureGroup;
  private _geometry: Leaflet.FeatureGroup;
  private _route_path: Leaflet.FeatureGroup;
  private _heat_group: Leaflet.FeatureGroup;

  private _user_is_hidden = false;
  private _system_defined_is_hidden = false;
  private _fetched_is_hidden = false;
  private _route_is_hidden = false;

  protected init (mapWrapper: MapsWrapper) {

      this._wrapper = mapWrapper;

      this._map = this._wrapper.map;
      this._layers = this._wrapper.layers;
      this._index = this._wrapper.index;

      this._user_defined = this._wrapper.featureGroup(LAYER_NAME.USER_DEFINED);
      this._system_defined = this._wrapper.featureGroup(LAYER_NAME.SYSTEM_DEFINED);
      this._fetched = this._wrapper.featureGroup(LAYER_NAME.FETCHED);
      // this._area_selected = this._wrapper.featureGroup(LAYER_NAME.AREA_SELECTED);
      this._geometry = this._wrapper.featureGroup(LAYER_NAME.GEOMETRIES);
      this._route_path = this._wrapper.featureGroup(LAYER_NAME.ROUTE_PATHS);
      this._heat_group = this._wrapper.featureGroup(LAYER_NAME.HEAT_MAPS);
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

  get system_defined(): Leaflet.FeatureGroup { return this._system_defined; }

  get fetched(): Leaflet.FeatureGroup { return this._fetched; }

  // get area_selected(): Leaflet.FeatureGroup { return this._area_selected; }

  get geometry(): Leaflet.FeatureGroup { return this._geometry; }

  get route_path(): Leaflet.FeatureGroup { return this._route_path; }

  get heat_group(): Leaflet.FeatureGroup { return this._heat_group; }


  get user_is_hidden(): boolean {
    return this._user_is_hidden;
  }

  get system_defined_is_hidden(): boolean {
    return this._system_defined_is_hidden;
  }

  get fetched_is_hidden(): boolean {
    return this._fetched_is_hidden;
  }

  get route_is_hidden(): boolean {
    return this._route_is_hidden;
  }

  protected populateLayer(latLngs: LatLngExpression[],
                          group: LayerGroup,
                          markerGenerator: (LatLngExpression) => Marker) {

    group.clearLayers();

    latLngs.forEach(p => markerGenerator(p).addTo(group));
  }

  protected toLatLng(c: GeoCoordinates) : LatLng{
    return latLng([c.lat, c.lng]);
  }

  private _showUserDefined() {
    this._user_is_hidden = false;
    this.wrapper.add(LAYER_NAME.USER_DEFINED, this.user_defined);
  }

  private _showRoute() {
    this._route_is_hidden = false;
    this.wrapper.add(LAYER_NAME.ROUTE_PATHS, this.route_path);
  }

  private _showFetched() {
    this._fetched_is_hidden = false;
    this.wrapper.add(LAYER_NAME.FETCHED, this.fetched);
  }

  private _showSystemDefined() {
    this._system_defined_is_hidden = false;
    this.wrapper.add(LAYER_NAME.SYSTEM_DEFINED, this.system_defined);
  }

  protected showUserDefinedMarkers(){


    if (!this.route_is_hidden) {
      this.hideRoute();
      this._showRoute();
    }

    if (!this.system_defined_is_hidden) {
      this.hideSystemDefinedMarkers();
      this._showSystemDefined();
    }

    this._showUserDefined();

    if (!this.fetched_is_hidden) {
      this.hideFetchedMarkers();
      this._showFetched();
    }
  }

  protected showSystemDefinedMarkers(){

    if (!this.route_is_hidden) {
      this.hideRoute();
      this._showRoute();
    }

    if (!this.user_is_hidden) {
      this.hideUserDefinedMarkers();
      this._showUserDefined();
    }

    this._showSystemDefined();

    if (!this.fetched_is_hidden) {
      this.hideFetchedMarkers();
      this._showFetched();
    }
  }

  protected showFetchedMarkers(){

    if (!this.route_is_hidden) {
      this.hideRoute();
      this._showRoute();
    }

    if (!this.system_defined_is_hidden) {
      this.hideSystemDefinedMarkers();
      this._showSystemDefined();
    }

    if (!this.user_is_hidden) {
      this.hideUserDefinedMarkers();
      this._showUserDefined();
    }

    this._showFetched();

  }

  protected showRoute(){

    this._showRoute();

    if (!this.system_defined_is_hidden) {
      this.hideSystemDefinedMarkers();
      this._showSystemDefined();
    }

    if (!this.user_is_hidden) {
      this.hideUserDefinedMarkers();
      this._showUserDefined();
    }

    if (!this.fetched_is_hidden) {
      this.hideFetchedMarkers();
      this._showFetched();
    }
  }

  protected hideUserDefinedMarkers() {
    this._user_is_hidden = true;
    this.layers.removeLayer(this.user_defined);
  }

  protected hideSystemDefinedMarkers(){
    this._system_defined_is_hidden = true;
    this.layers.removeLayer(this.system_defined);
  }

  protected hideFetchedMarkers() {
    this._fetched_is_hidden = true;
    this.layers.removeLayer(this.fetched);
  }

  protected hideRoute() {
    this._route_is_hidden = true;
    this.layers.removeLayer(this.route_path);
  }


  protected showAllMarkers(){
    this._showRoute();
    this._showSystemDefined();
    this._showUserDefined();
    this._showFetched();
  }

  protected hideAllMarkers(){
    this.hideUserDefinedMarkers();
    this.hideFetchedMarkers();
    this.hideSystemDefinedMarkers();
  }
}
