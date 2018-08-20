import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MapSingleton} from "../../map-singleton";
import L from 'leaflet';
import * as $ from 'jquery';
import {CoordinatesOverlay} from "./coordinates-overlay";

@Component({
  selector: 'app-coordinates',
  templateUrl: './coordinates.component.html',
  styleUrls: ['./coordinates.component.css']
})
export class CoordinatesComponent implements OnInit, AfterViewInit {

  private osmMap: L.Map;
  private layers: L.LayerGroup;
  private index: number[];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    $(document).ready(() => {

      this.osmMap = MapSingleton.instance().map();
      this.layers = MapSingleton.instance().layers();
      this.index = MapSingleton.instance().index();

      // console.log(this.index);
      // console.log(this.osmMap);
      // console.log(this.layers);

      $("#coordinates-overlay-close-button").on('click', function (clickEvent) {
        $('#coordinates-overlay').fadeOut(200);
      });

      this.osmMap.on('click', function (event) {
        CoordinatesOverlay.showCoordinates(event.latlng);
      });

      this.osmMap.on('move', function (moveEvent) {
        $(".overlay").each(function (idx, obj) {
          $(obj).hide();
        });
      });

      $('#lat-lng-span').on( 'click', function(clickEvent) {

        let coordinates = $('#lat-lng-input') as HTMLInputElement;

        coordinates.select();

        document.execCommand("copy");

        $('#message').html("Copied!");
        $('#messages-overlay').fadeIn(100, function () {
          setTimeout(function () {
            $('#messages-overlay').fadeOut(100);
            $('#message').html = "";
          }, 500);
        });
      });

    });
  }
}
