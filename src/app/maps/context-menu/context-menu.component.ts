import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LAYER_NAME, MapSingleton} from "../map-singleton";
import * as $ from "jquery";
import * as L from 'leaflet';
// import 'leaflet-draw';
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
  private osmMap: L.Map;
  private layers: L.LayerGroup;
  private index: number[];

  private _coordinates : L.LatLng;

  public set coordinates (coordinates : L.LatLng)  {
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
    $(document).ready(() => {

    });
  }

  ngAfterViewInit(): void {
    let that = this;

    $(document).ready(() => {

      this.osmMap = MapSingleton.instance.map;
      this.layers = MapSingleton.instance.layers;
      this.index = MapSingleton.instance.index ;

      let user_defined : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.USER_DEFINED]) as L.FeatureGroup,
          fetched : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.FETCHED]) as L.FeatureGroup,
          area_selected : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.AREA_SELECTED]) as L.FeatureGroup,
          geometry : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.GEOMETRY]) as L.FeatureGroup;

      this.osmMap.on('contextmenu', function (event : L.LeafletMouseEvent) {
        CoordinatesComponent.showCoordinates(event.latlng, false);

        that.coordinates = event.latlng;

        $('.context-menu').css({
          display: "grid",
          transaction: 0.5,
          top: (event.containerPoint.y + 10).toString() + "px",
          left: (event.containerPoint.x + 10).toString() + "px"
        });
      });
    });
  }

  clearLayers = (event : Event) => {
    let user_defined : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.USER_DEFINED]) as L.FeatureGroup,
        fetched : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.FETCHED]) as L.FeatureGroup,
        area_selected : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.AREA_SELECTED]) as L.FeatureGroup,
        geometry : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.GEOMETRY]) as L.FeatureGroup;

    user_defined.clearLayers();
    fetched.clearLayers();
    area_selected.clearLayers();
    geometry.clearLayers();
    $('.context-menu').fadeOut(100);
  };

  addMarker = (event : Event) => {
    let user_defined : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.USER_DEFINED]) as L.FeatureGroup;
    L.marker(this.coordinates).addTo(user_defined);
    ContextMenuComponent._addMarker(this.coordinates, this.restService, this.toasterService);
    $('.context-menu').fadeOut(100);
  };

  addArea = (event : Event) => {

    let geometry : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.GEOMETRY]) as L.FeatureGroup,
        that = this;

    geometry.clearLayers();

    let circle = new L.Circle(that.coordinates, {
      radius: 10000,
      color: "red",
      weight: 3
    });

    circle.addTo(geometry);

    console.log(circle.getBounds());

    var release = false;

    circle.on('click', (click : L.LeafletMouseEvent) => {

      if (!release) {
        console.log("captured!");
        that.osmMap.on('mousemove', function (move : L.LeafletMouseEvent) {
          circle.setLatLng(move.latlng);
        });
        release = true;
      } else {
        console.log("released");
        // @ts-ignore
        that.osmMap.removeEventListener('mousemove');
        circle.setLatLng(click.latlng);
        release = false;
      }
    });

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
    restService.addMarker(geoCoordinates, X => { toasterService.pop(successToast); });
  }
}
