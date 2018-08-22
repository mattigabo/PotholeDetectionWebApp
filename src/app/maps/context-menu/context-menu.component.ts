import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LAYER_NAME, MapSingleton} from "../map-singleton";
import * as $ from "jquery";
import * as Leaflet from 'leaflet';
import 'leaflet-draw';
import {CoordinatesComponent} from "../coordinates/coordinates.component";
import {RestAdapterService} from "../../rest-adapter.service";
import {Toast, ToasterService} from "angular2-toaster";
import {GeoCoordinates} from "../../Ontologies";

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit, AfterViewInit {
  private _map: Leaflet.Map;
  private _layers: Leaflet.LayerGroup;
  private _index: number[];

  private _coordinates : Leaflet.LatLng;
  private _circleMaker: Leaflet.Draw.Circle;
  private _circleEditor: Leaflet.EditToolbar.Edit;

  private _circleOptions = {
    shapeOptions: {
      color: 'red'
    },
    metric: true,
    showRadius: true,
  };



  public set coordinates (coordinates : Leaflet.LatLng)  {
    this._coordinates = coordinates;
  };

  public get coordinates () {
    return this._coordinates;
  }

  constructor(
    private restService: RestAdapterService,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    let that = this;

    this._map = MapSingleton.instance.map;
    this._layers = MapSingleton.instance.layers;
    this._index = MapSingleton.instance.index ;

    let user_defined = MapSingleton.instance.layer(LAYER_NAME.USER_DEFINED),
        fetched = MapSingleton.instance.layer(LAYER_NAME.FETCHED),
        area_selected = MapSingleton.instance.layer(LAYER_NAME.AREA_SELECTED),
        geometry = MapSingleton.instance.layer(LAYER_NAME.GEOMETRY);

    this._circleMaker = new Leaflet.Draw.Circle(this._map, this._circleOptions);

    this._circleEditor = new Leaflet.EditToolbar.Edit(this._map, {
      // @ts-ignore
      featureGroup: geometry
    });

    this._map.on('contextmenu', function (event : Leaflet.LeafletMouseEvent) {
      CoordinatesComponent.showCoordinates(event.latlng, false);

      that.coordinates = event.latlng;

      $('.context-menu').css({
        display: "grid",
        transaction: 0.5,
        top: (event.containerPoint.y + 10).toString() + "px",
        left: (event.containerPoint.x + 10).toString() + "px"
      });
    });
  }

  clearLayers = (event : Event) => {
    let user_defined : Leaflet.FeatureGroup = this._layers.getLayer(this._index[LAYER_NAME.USER_DEFINED]) as Leaflet.FeatureGroup,
        fetched : Leaflet.FeatureGroup = this._layers.getLayer(this._index[LAYER_NAME.FETCHED]) as Leaflet.FeatureGroup,
        area_selected : Leaflet.FeatureGroup = this._layers.getLayer(this._index[LAYER_NAME.AREA_SELECTED]) as Leaflet.FeatureGroup,
        geometry : Leaflet.FeatureGroup = this._layers.getLayer(this._index[LAYER_NAME.GEOMETRY]) as Leaflet.FeatureGroup;

    user_defined.clearLayers();
    fetched.clearLayers();
    area_selected.clearLayers();
    geometry.clearLayers();
    $('.context-menu').fadeOut(100);
  };

  addMarker = (event : Event) => {
    let user_defined : Leaflet.FeatureGroup = this._layers.getLayer(this._index[LAYER_NAME.USER_DEFINED]) as Leaflet.FeatureGroup;
    Leaflet.marker(this.coordinates).addTo(user_defined);
    ContextMenuComponent._addMarker(this.coordinates, this.restService, this.toasterService);
    $('.context-menu').fadeOut(100);
  };

  addArea = (event : Event) => {

    let geometry : Leaflet.FeatureGroup = this._layers.getLayer(this._index[LAYER_NAME.GEOMETRY]) as Leaflet.FeatureGroup,
        that = this;

    geometry.clearLayers();

    this._circleMaker.enable();
    // @ts-ignore
    this._circleEditor.disable();

    $('.context-menu').fadeOut(100);
  };

  private static _addMarker(coordinates, restService: RestAdapterService, toasterService: ToasterService){
    let infoToast: Toast = {
      type: 'info',
      title: 'Prova',
      body: "Marker successfully added",
      showCloseButton: true
    };

    // toasterService.pop(infoToast);

    let successToast: Toast = {
      type: 'success',
      title: 'Marker Added',
      body: "Marker successfully added",
      showCloseButton: true
    };

    let errorToast: Toast = {
      type: 'error',
      title: 'Marker Not Added',
      body: "Error occured during the marker adding",
      showCloseButton: true
    };

    let geoCoordinates: GeoCoordinates = new GeoCoordinates(coordinates.lat, coordinates.lng);
    restService.addMarker(geoCoordinates,
      X =>  toasterService.pop(successToast),
      err => toasterService.pop(errorToast),
    );
  }
}
