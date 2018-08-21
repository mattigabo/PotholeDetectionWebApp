import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import * as $ from 'jquery';
import {CoordinatesOverlay} from "../coordinates/coordinates-overlay";
import {RestAdapterService} from "../../rest-adapter.service";
import {MapSingleton} from "../../map-singleton";
import {CoordinatesComponent} from "../coordinates/coordinates.component";

@Component({
  selector: 'app-markers-popup',
  templateUrl: './markers-popup.component.html',
  styleUrls: ['./markers-popup.component.css']
})
export class MarkersPopupComponent implements OnInit,AfterViewInit {

  private osmMap : L.Map;
  private layers : L.LayerGroup;
  private index : number[];

  constructor(private restService : RestAdapterService) { }

  ngOnInit() {
    $(document).ready(() => {

    });
  }

  ngAfterViewInit(): void {
    $(document).ready(() => {

      this.osmMap = MapSingleton.instance().map();
      this.layers = MapSingleton.instance().layers();
      this.index = MapSingleton.instance().index();

      // console.log(this.index);
      // console.log(this.osmMap);
      // console.log(this.layers);

      this.layers.getLayer(this.index["user-defined"])
        .on('click', MarkersPopupComponent.displayMarkerPopUp);

      this.layers.getLayer(this.index["fetched"])
        .on('click', MarkersPopupComponent.displayMarkerPopUp);

      this.layers.getLayer(this.index["area-selected"])
        .on('click', MarkersPopupComponent.displayMarkerPopUp);

      $('#marker-popup-close-button').on('click', function () {
        $('#marker-popup').fadeOut(300);
      });

      $('#marker-popup-send-button').on('click', function () {
        // To Do
      });
    });
  }

  public static displayMarkerPopUp =  function (clickEvent) {

    CoordinatesComponent.showCoordinates(clickEvent.latlng);

    let
      lat = clickEvent.latlng.lat.toFixed(4).toString(),
      lng = clickEvent.latlng.lng.toFixed(4).toString()
    ;

    if (clickEvent.latlng) {

      $('#marker-popup-var--coordinates-lat').text(lat);
      $('#marker-popup-var--coordinates-lng').text(lng);

      let marker_popup = $('#marker-popup');

      marker_popup.fadeIn(300);
      marker_popup.css({
        display: 'flex'
      });
    }
  }

}
