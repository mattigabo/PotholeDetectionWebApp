import {CoordinatesOverlay} from "../coordinates/coordinates-overlay";
import * as $ from "jquery";
import L from 'leaflet';
import {RestAdapterService} from "../../rest-adapter.service";
import {GeoCoordinates} from "../../Ontologies";
import {Toast, ToasterService} from "angular2-toaster";

export class ContextMenu {

  private static lat = 0.0;
  private static lng = 0.0;

  constructor(map : L.Map,
              user_defined : L.FeatureGroup,
              fetched : L.FeatureGroup,
              area_selected : L.FeatureGroup,
              restService: RestAdapterService,
              toasterService: ToasterService) {

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
      ContextMenu.addMarker(ContextMenu.getCoordinates(), restService, toasterService);
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

  private static addMarker(coordinates, restService: RestAdapterService, toasterService: ToasterService){
    // var infoToast: Toast = {
    //   type: 'info',
    //   title: 'Prova',
    //   body: "Marker successfully added",
    //   showCloseButton: true
    // };
    //
    // toasterService.pop(infoToast);

    var successToast: Toast = {
      type: 'success',
      title: 'Marker Added',
      body: "Marker successfully added",
      showCloseButton: true
    };

    var errorToast: Toast = {
      type: 'error',
      title: 'Marker Not Added',
      body: "Error occured during the marker adding",
      showCloseButton: true
    };

    var geoCoordinates: GeoCoordinates = new GeoCoordinates(coordinates.lat, coordinates.lng);
    restService.addMarker(geoCoordinates, X => { alert(successToast.body); });
  }
}
