import * as $ from "jquery";

export class CoordinatesService {

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
          top = coordinates.containerPoint.y + 10,
          left = coordinates.containerPoint.x + 10
        ;

        let overlay = $('#coordinates-overlay');

        overlay.css({
          "top": top.toString() + "px",
          "left": left.toString() + "px",
          "display": "block"
        });
      }
    });

    map.on('move', function (moveEvent) {
      $('#coordinates-overlay').hide(100);
    });

    $("#coordinates-overlay-close-button").on('click', function (clickEvent) {
        $('#coordinates-overlay').hide(100);
      });

    $(document).on('keyup', function (keyEvent) {
      let key = keyEvent.key.toUpperCase();
      console.log(key);

      if (key === "ESCAPE") {
        let p = $('.overlay').each(function (idx, obj) {
          $(obj).hide();
        });

        $('#menu-button').show();
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
  }
}
