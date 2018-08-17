import * as $ from "jquery";
import L from 'leaflet';

export class FeaturesService {

  private static lat = 0.0;

  private static lng = 0.0;

  constructor (map) {

    let newMarkers = L.featureGroup();

    newMarkers.on('click', function (clickEvent) {

      let
        lat = clickEvent.latlng.lat.toFixed(4).toString(),
        lng = clickEvent.latlng.lng.toFixed(4).toString()
      ;

      if (clickEvent.latlng) {

        let
          top = clickEvent.containerPoint.y - 200,
          left = clickEvent.containerPoint.x - 100
        ;

        $('#marker-popup-val').html(lat + '<strong> N </strong>, ' + lng + '<strong> E </strong> ');

        let marker_popup = $('#marker-popup');

        // console.log($('#marker-popup-val').html());
        marker_popup.css({
          width:"toggle",
          display: 'flex',
          left: left.toString() + "px",
          top: top.toString() + "px"
        });

        marker_popup.show(100);
      }
    });

    newMarkers.addTo(map);

    let showCoordinates = function(coordinates) {

      let
        lat = coordinates.lat.toFixed(4).toString(),
        lng = coordinates.lng.toFixed(4).toString()
      ;

      if (coordinates) {
        $('#lat-lng-span').html(lat + '<strong> N </strong>, ' + lng + '<strong> E </strong> ');

        $('#lat-lng-input').attr("value", lat + " N, " + lng + " E");

        let overlay = $('#coordinates-overlay');

        overlay.css({
          display: "flex"
        });

        $('.context-menu').hide(100);
      }
    };

    $("#coordinates-overlay-close-button").on('click', function (clickEvent) {
      $('#coordinates-overlay').hide(100);
    });

    map.on('click', function (event) {
      showCoordinates(event.latlng);
    });

    map.on('move', function (moveEvent) {
      $('#coordinates-overlay').hide(100);
      $('.context-menu').hide(100);
    });

    map.on('contextmenu', function (contextEvent) {
      showCoordinates(contextEvent.latlng);

      FeaturesService.setCoordinates(contextEvent.latlng);

      $('.context-menu').css({
        display: "grid",
        transaction: 0.5,
        top: (contextEvent.containerPoint.y + 10).toString() + "px",
        left: (contextEvent.containerPoint.x + 10).toString() + "px"
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

    $('#add-marker').on('click', function () {
      L.marker(FeaturesService.getCoordinates()).addTo(newMarkers);

      $('.context-menu').fadeOut(100);
    });

    $('#add-area-selector').on('click', function () {
      // TO DO
    });

    $('#clear-layers').on('click', function () {
      // BOH...
    });

  }

  private static setCoordinates(coordinates) {
    FeaturesService.lat = coordinates.lat;
    FeaturesService.lng = coordinates.lng;
  }

  private static getCoordinates() {
    return {
      lat: FeaturesService.lat,
      lng: FeaturesService.lng
    };
  }
}
