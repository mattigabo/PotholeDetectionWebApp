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
  private _user_position: Leaflet.FeatureGroup;

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
      this._user_position = this._wrapper.featureGroup(LAYER_NAME.USER_POSITION);
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

  get user_position(): Leaflet.FeatureGroup { return this._user_position; }

  get isUserHidden(): boolean {
    return this.wrapper.isUserHidden;
  }

  get isDefaultHidden(): boolean {
    return this.wrapper.isDefaultHidden;
  }

  get isFetchedHidden(): boolean {
    return this.wrapper.isFetchedHidden;
  }

  get isRouteHidden(): boolean {
    return this.wrapper.isRouteHidden;
  }

  get isPositionHidden(): boolean {
    return this.wrapper.isPositionHidden;
  }

  set isPositionHidden(value: boolean) {
    this.wrapper.isPositionHidden = value;
  }

  set isFetchedHidden(value: boolean) {
    this.wrapper.isFetchedHidden = value;
  }
  set isDefaultHidden(value: boolean) {
    this.wrapper.isDefaultHidden = value;
  }

  set isUserHidden(value: boolean) {
    this.wrapper.isUserHidden = value;
  }

  set isRouteHidden(value: boolean){
    this.wrapper.isRouteHidden = value;
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


  protected showRouteLayer() {
    this.isRouteHidden = false;
    this.wrapper.add(LAYER_NAME.ROUTE_PATHS, this.route_path);
  }

  protected showUserDefinedLayer() {
    this.isUserHidden = false;
    this.wrapper.add(LAYER_NAME.USER_DEFINED, this.user_defined);
  }

  protected showFetchedLayer() {
    this.isFetchedHidden = false;
    this.wrapper.add(LAYER_NAME.FETCHED, this.fetched);
  }

  protected showDefaultLayer() {
    this.isDefaultHidden = false;
    this.wrapper.add(LAYER_NAME.SYSTEM_DEFINED, this.system_defined);
  }

  protected showUserPositionLayer() {
    this.isPositionHidden = false;
    this.wrapper.add(LAYER_NAME.USER_POSITION, this.user_position)
  }

  protected showUserDefinedLayerOrdered(){

    if (!this.isRouteHidden) {
      this.hideRouteLayer();
      this.showRouteLayer();
    }

    if (!this.isDefaultHidden) {
      this.hideDefaultLayer();
      this.showDefaultLayer();
    }

    this.showUserDefinedLayer();

    if (!this.isFetchedHidden) {
      this.hideFetchedLayer();
      this.showFetchedLayer();
    }

    if (!this.isPositionHidden) {
      this.hideUserPositionLayer();
      this.showUserPositionLayer();
    }
  }

  protected showDefaultLayerOrdered(){

    if (!this.isRouteHidden) {
      this.hideRouteLayer();
      this.showRouteLayer();
    }

    if (!this.isUserHidden) {
      this.hideUserDefinedLayer();
      this.showUserDefinedLayer();
    }

    this.showDefaultLayer();

    if (!this.isFetchedHidden) {
      this.hideFetchedLayer();
      this.showFetchedLayer();
    }

    if (!this.isPositionHidden) {
      this.hideUserPositionLayer();
      this.showUserPositionLayer();
    }
  }

  protected showFetchedLayerOrdered(){

    if (!this.isRouteHidden) {
      this.hideRouteLayer();
      this.showRouteLayer();
    }

    if (!this.isDefaultHidden) {
      this.hideDefaultLayer();
      this.showDefaultLayer();
    }

    if (!this.isUserHidden) {
      this.hideUserDefinedLayer();
      this.showUserDefinedLayer();
    }

    this.showFetchedLayer();

    if (!this.isPositionHidden) {
      this.hideUserPositionLayer();
      this.showUserPositionLayer();
    }
  }

  protected showRouteLayerOrdered(){

    this.showRouteLayer();

    if (!this.isDefaultHidden) {
      this.hideDefaultLayer();
      this.showDefaultLayer();
    }

    if (!this.isUserHidden) {
      this.hideUserDefinedLayer();
      this.showUserDefinedLayer();
    }

    if (!this.isFetchedHidden) {
      this.hideFetchedLayer();
      this.showFetchedLayer();
    }

    if (!this.isPositionHidden) {
      this.hideUserPositionLayer();
      this.showUserPositionLayer();
    }
  }
  protected showUserPositionLayerOrdered(){

    if (!this.isRouteHidden) {
      this.hideRouteLayer();
      this.showRouteLayer();
    }

    if (!this.isDefaultHidden) {
      this.hideDefaultLayer();
      this.showDefaultLayer();
    }

    if (!this.isUserHidden) {
      this.hideUserDefinedLayer();
      this.showUserDefinedLayer();
    }

    if (!this.isFetchedHidden) {
      this.hideFetchedLayer();
      this.showFetchedLayer();
    }

    this.showUserPositionLayer();
  }

  protected hideUserDefinedLayer() {
    this.isUserHidden = true;
    this.layers.removeLayer(this.user_defined);
  }

  protected hideDefaultLayer(){
    this.isDefaultHidden = true;
    this.layers.removeLayer(this.system_defined);
  }

  protected hideFetchedLayer() {
    this.isFetchedHidden = true;
    this.layers.removeLayer(this.fetched);
  }

  protected hideRouteLayer() {
    this.isRouteHidden = true;
    this.layers.removeLayer(this.route_path);
  }

  protected hideUserPositionLayer() {
    this.isPositionHidden = true;
    this.layers.removeLayer(this.user_position);
  }

  protected showAllLayersOrdered(){
    this.showRouteLayer();
    this.showDefaultLayer();
    this.showUserDefinedLayer();
    this.showFetchedLayer();
    this.showUserPositionLayer()
  }

  protected hideAllLayers(){
    this.hideRouteLayer();
    this.hideUserDefinedLayer();
    this.hideFetchedLayer();
    this.hideDefaultLayer();
    this.hideUserPositionLayer()
  }

  protected showAllLayers(){
    this.showRouteLayer();
    this.showFetchedLayer();
    this.showDefaultLayer();
    this.showUserDefinedLayer();
    this.showUserPositionLayer()
  }

}
