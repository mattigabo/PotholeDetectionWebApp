import {CoordinatesOverlay} from "../coordinates/coordinates-overlay";
import * as $ from "jquery";
import L from 'leaflet';

export class ContextMenu {

  private static lat = 0.0;
  private static lng = 0.0;

  constructor(map : L.Map,
              user_defined : L.FeatureGroup,
              fetched : L.FeatureGroup,
              area_selected : L.FeatureGroup) {

    map.on('contextmenu', function (contextEvent) {
      CoordinatesOverlay.showCoordinates(contextEvent.latlng, false);

      ContextMenu.setCoordinates(contextEvent.latlng);

      $('.context-menu').css({
        display: "grid",
        transaction: 0.5,
        top: (contextEvent.containerPoint.y + 10).toString() + "px",
        left: (contextEvent.containerPoint.x + 10).toString() + "px"
      });
    });

    $('#add-marker').on('click', function () {
      L.marker(ContextMenu.getCoordinates()).addTo(user_defined);

      $('.context-menu').fadeOut(100);
    });

    $('#add-area-selector').on('click', function () {
      // TO DO
      $('.context-menu').fadeOut(100);
    });

    $('#clear-layers').on('click', function () {
      user_defined.clearLayers();
      fetched.clearLayers();
      area_selected.clearLayers();
      $('.context-menu').fadeOut(100);
    });
  }

  private static setCoordinates(coordinates) {
    ContextMenu.lat = coordinates.lat;
    ContextMenu.lng = coordinates.lng;
  }

  private static getCoordinates() {
    return {
      lat: ContextMenu.lat,
      lng: ContextMenu.lng
    };
  }
}
