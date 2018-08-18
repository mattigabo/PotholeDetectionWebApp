import * as $ from "jquery";
import L from 'leaflet';

export class MarkersPopup {

  constructor(map : L.Map, featureGroups: L.FeatureGroup[]) {
    featureGroups.forEach((group) => {
      group.on('click', function (clickEvent) {

        let
          lat = clickEvent.latlng.lat.toFixed(4).toString(),
          lng = clickEvent.latlng.lng.toFixed(4).toString()
        ;

        if (clickEvent.latlng) {

          $('#marker-popup-var--coordinates').html(lat + '<strong> N </strong>, ' + lng + '<strong> E </strong> ');

          let marker_popup = $('#marker-popup');

          marker_popup.fadeIn(300);
          marker_popup.css({
            display: 'flex'
          });
        }
      });
    });

    $('#marker-popup-close-button').on('click', function () {
      $('#marker-popup').fadeOut(300);
    });

    $('#marker-popup-send-button').on('click', function () {
      // To Do
    });
  }
}
