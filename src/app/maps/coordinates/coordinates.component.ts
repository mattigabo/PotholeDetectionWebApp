import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LAYER_NAME, MapsWrapper} from "../maps.wrapper";
import * as Leaflet from 'leaflet';
import * as $ from 'jquery';
import {Toast, ToasterService} from "angular2-toaster";
import {DistributionService, Entry} from "../distribution.service";
import {CoordinatesService} from "./coordinates.service";

@Component({
  selector: 'app-coordinates',
  templateUrl: './coordinates.component.html',
  styleUrls: ['./coordinates.component.css']
})
export class CoordinatesComponent implements OnInit, AfterViewInit {

  private _wrapper: MapsWrapper;

  private _map: Leaflet.Map;
  private _layers: Leaflet.LayerGroup;
  private _index: number[];

  private _user_defined: Leaflet.FeatureGroup;
  private _fetched: Leaflet.FeatureGroup;
  private _area_selected: Leaflet.FeatureGroup;
  private _geometry: Leaflet.FeatureGroup;

  constructor(private toastService: ToasterService,
              private coordinatesService: CoordinatesService,
              private distributionService: DistributionService) {

    distributionService.subscribe(entry => {
      if (entry.key === MapsWrapper.name) {
        this._wrapper = entry.value as MapsWrapper;

        this._map = this._wrapper.map;
        this._layers = this._wrapper.layers;
        this._index = this._wrapper.index;

        this._user_defined = this._wrapper.layer(LAYER_NAME.USER_DEFINED);
        this._fetched = this._wrapper.layer(LAYER_NAME.FETCHED);
        this._area_selected = this._wrapper.layer(LAYER_NAME.AREA_SELECTED);
        this._geometry = this._wrapper.layer(LAYER_NAME.GEOMETRY);

        this._map.on('click', (event : Leaflet.LeafletMouseEvent) => this.showCoordinates(event.latlng));

        this._map.on('move', this.hideOverlays);

        console.log("Coordinates Component Ready!");
      }
    });

  }

  ngOnInit() {

    this.distributionService.subscribe(event => {
      console.log(event);
      if (event.key === CoordinatesService.ACTIONS.DISPLAY) {
        let coordinates = (event.value as Entry<Leaflet.LatLng, boolean>).key;
        let options = (event.value as Entry<Leaflet.LatLng, boolean>).value;
        this.showCoordinates(coordinates, options);
      } else if (event.key === CoordinatesService.ACTIONS.HIDE) {
        $('#coordinates-overlay').fadeOut(200);
      } else if (event.key === CoordinatesService.ACTIONS.HIDE_ALL) {
        this.hideOverlays(event.value as Event);
      }
    });
  }

  ngAfterViewInit() {

  }

  onCloseFadeCoordinatesOverlay = (event : Event) => {
    $('#coordinates-overlay').fadeOut(200);
  };

  onClickCopyCoordinates = (event : Event) => {
    let coordinates = $('#lat-lng-input') as HTMLInputElement;

    coordinates.select();

    document.execCommand("copy");

    var infoToast: Toast = {
      type: 'info',
      body: "Coordinates copied!",
      showCloseButton: true
    };

    this.toastService.pop(infoToast);
  };

  private hideOverlays = (event : Event) => {
    $('.overlay').each(function (idx, obj) {
      $(obj).hide();
    });
  };

  private showCoordinates = function(coordinates: Leaflet.LatLng, closeContextMenu = true) {

    let
      lat = coordinates.lat.toFixed(4).toString(),
      lng = coordinates.lng.toFixed(4).toString()
    ;

    if (closeContextMenu) {
      $('.context-menu').each(function (idx, obj) {
        $(obj).fadeOut(100);
      })
    }

    if (coordinates) {
      $('#lat-lng-span').html(lat + '<strong> N </strong>, ' + lng + '<strong> E </strong> ');

      $('#lat-lng-input').attr("value", lat + " N, " + lng + " E");

      let overlay = $('#coordinates-overlay');

      overlay.css({
        display: 'flex'
      });
    }
  };
}
