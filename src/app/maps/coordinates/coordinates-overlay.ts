import * as $ from "jquery";
import L from 'leaflet';

export class CoordinatesOverlay {

  constructor(private map : L.Map) {

    $("#coordinates-overlay-close-button").on('click', function (clickEvent) {
      $('#coordinates-overlay').fadeOut(200);
    });

    map.on('click', function (event) {
      CoordinatesOverlay.showCoordinates(event.latlng);
    });

    map.on('move', function (moveEvent) {
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
  }

  public static showCoordinates = function(coordinates, closeContextMenu = true) {

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
