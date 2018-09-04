
import {LAYER_NAME, MapsWrapper} from "./maps/maps.wrapper";
import * as Leaflet from 'leaflet';
import {AfterViewInit, OnInit} from "@angular/core";
import {LatLng, LatLngExpression, LatLngLiteral} from "leaflet";
import {LngLat, RouteAPIResponse} from "./ontologies/RouteData";
import * as LeafletHotline from '../../node_modules/leaflet-hotline';
import {Marker} from "./ontologies/DataStructures";

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

  private hotlineOption =  {
    min: 30,
    max: 350,
    palette: {
      0.0: '#ff0000',
      0.5: '#ffff00',
      1.0: '#008800'
    },
    weight: 5,
    outlineColor: '#000000',
    outlineWidth: 1,
    smoothFactor: 0
  }


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

  public drawRoutePath(responseContent: RouteAPIResponse){
    let lngLats: LngLat[] = responseContent.routingServiceResponse.routes[0].geometry.coordinates;
    let  markers: Marker[] = responseContent.markers;

    let hotLineData = this.createHotlineData(lngLats, markers);
    var routePathHotline = LeafletHotline.hotline(hotLineData, this.hotlineOption);

    routePathHotline.bindPopup("Potholes founded along this route:" + markers.length +
      + " Route calculated by " + responseContent.routingServiceResponse.info.attribution);
    routePathHotline.addTo(this._route_path);
    // zoom the map to the polyline
    this._map.fitBounds(routePathHotline.getBounds());
  }


  private createHotlineData(lngLats: LngLat[], markers: Marker[]): number[][]{
    let latLngs: LatLngLiteral[] = this.generateLatLngLiteralsFormat(lngLats);
    var result:  number[][] = [];
    latLngs.forEach(value => {
      result.push([
        value.lat,
        value.lng,
        this.calculatePaletteColor(new LatLng(value.lat,value.lng), markers)
      ]);
    });
    console.log(result);
    return result;
  }

  private calculatePaletteColor(currPoint: LatLng, markers: Marker[]): number{
    var distances: number[] = markers.map(m => currPoint.distanceTo(new LatLng(m.coordinates.lat, m.coordinates.lng)))
      .sort((a,b) => a - b);
    console.log(distances);

    return distances[0];
  }

  private generateLatLngLiteralsFormat(lngLats: LngLat[]): LatLngLiteral[]{
    console.log(lngLats);
    var latLngs: LatLngLiteral[] = [];
    lngLats.forEach((value: LngLat) => {
      var formatCorrected: LatLngLiteral = { lat: value[1], lng: value[0] }
      latLngs.push(formatCorrected);
    });
    return latLngs;
  }

}
