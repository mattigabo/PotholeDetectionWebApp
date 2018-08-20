import * as $ from "jquery";
import L from 'leaflet';
import {CoordinatesOverlay} from "../coordinates/coordinates-overlay";

export class MarkersPopup {

  constructor(map : L.Map, featureGroups: L.FeatureGroup[]) {
    featureGroups.forEach((group) => {
      group.on('click', function (clickEvent) {

        CoordinatesOverlay.showCoordinates(clickEvent.latlng);

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
