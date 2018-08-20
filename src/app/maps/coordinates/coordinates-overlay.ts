import * as $ from "jquery";

export class CoordinatesOverlay {

  constructor() {}

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
