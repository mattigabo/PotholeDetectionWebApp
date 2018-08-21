import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MapSingleton} from "../map-singleton";
import * as L from 'leaflet';
import * as $ from 'jquery';
import {Toast, ToasterService} from "angular2-toaster";

@Component({
  selector: 'app-coordinates',
  templateUrl: './coordinates.component.html',
  styleUrls: ['./coordinates.component.css']
})
export class CoordinatesComponent implements OnInit, AfterViewInit {

  private osmMap: L.Map;
  private layers: L.LayerGroup;
  private index: number[];

  constructor(private toastService: ToasterService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    $(document).ready(() => {

      this.osmMap = MapSingleton.instance.map;
      this.layers = MapSingleton.instance.layers;
      this.index = MapSingleton.instance.index;

      this.osmMap.on('click', function (event : L.LeafletMouseEvent) {
        CoordinatesComponent.showCoordinates(event.latlng);
      });

      this.osmMap.on('move', CoordinatesComponent.hideOverlays);
    });
  }

  fadeCoordinates = (event : Event) => {
    $('#coordinates-overlay').fadeOut(200);
  };

  copyCoordinates = (event : Event) => {
    CoordinatesComponent._copyCoordinates(event, this.toastService);
  };

  public static hideOverlays = (event : Event) => {
    $('.overlay').each(function (idx, obj) {
      $(obj).hide();
    });
  };

  public static _copyCoordinates = (event: Event, toasterService: ToasterService) => {

    let coordinates = $('#lat-lng-input') as HTMLInputElement;

    coordinates.select();

    document.execCommand("copy");

    var infoToast: Toast = {
      type: 'info',
      body: "Coordinates copied!",
      showCloseButton: true
    };

    toasterService.pop(infoToast);
  };

  public static showCoordinates = function(coordinates: L.LatLng, closeContextMenu = true) {

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
