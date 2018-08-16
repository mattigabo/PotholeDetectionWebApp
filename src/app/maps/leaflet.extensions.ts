import * as $ from "jquery";
import L from 'leaflet';

export class FeaturesService {

  private static lat = 0.0;

  private static lng = 0.0;

  constructor (map) {

    map.on('click', function(coordinates) {

      let
        lat = coordinates.latlng.lat.toFixed(4).toString(),
        lng = coordinates.latlng.lng.toFixed(4).toString()
      ;

      if (coordinates.latlng) {
        $('#lat-lng-span').html(lat + '<strong> N </strong>, ' + lng + '<strong> E </strong> ');

        $('#lat-lng-input').attr("value", lat + " N, " + lng + " E");

        let
          top = coordinates.containerPoint.y - 40,
          left = coordinates.containerPoint.x - 200
        ;

        let overlay = $('#coordinates-overlay');

        overlay.css({
          "top": top.toString() + "px",
          "left": left.toString() + "px",
          "display": "block"
        });

        $('.context-menu').hide(100);
      }
    });

    map.on('move', function (moveEvent) {
      $('#coordinates-overlay').hide(100);
      $('.context-menu').hide(100);
    });

    $("#coordinates-overlay-close-button").on('click', function (clickEvent) {
        $('#coordinates-overlay').hide(100);
    });

    map.on('contextmenu', function (contextEvent) {
      FeaturesService.setCoordinates(contextEvent.latlng);
      $('.context-menu').css({
        display: "grid",
        transaction: 0.5,
        top: (contextEvent.containerPoint.y + 10).toString() + "px",
        left: (contextEvent.containerPoint.x + 10).toString() + "px"
      });
    });

    $(document).on('keyup', function (keyEvent) {
      let key = keyEvent.key ? keyEvent.key.toUpperCase() : keyEvent.which;

      if (key === "ESCAPE") {
        $('.close-on-esc').each(function (idx, obj) {
          $(obj).hide();
        });

        $('.open-on-esc').each(function (idx, obj) {
          $(obj).show();
        });
      }
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
      L.marker(FeaturesService.getCoordinates())
        .addTo(map)
        .bindPopup($('#leaflet-popup-html').html);

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
