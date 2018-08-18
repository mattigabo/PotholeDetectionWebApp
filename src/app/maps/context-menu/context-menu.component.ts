import { Component, OnInit } from '@angular/core';
// import * as $ from "jquery";
// import L from 'leaflet';
// import {FeaturesService} from "../leaflet.extensions";

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {

  constructor(
    // private map: L.Map,
    // private newMarkers : L.FeatureGroup,
    // private featureGroups: L.FeaturesGroup
  ) { }

  ngOnInit() {

    // let that : ContextMenuComponent = this;
    //
    // that.map.on('contextmenu', function (contextEvent) {
    //   FeaturesService.showCoordinates(contextEvent.latlng);
    //
    //   FeaturesService.setCoordinates(contextEvent.latlng);
    //
    //   $('.context-menu').css({
    //     display: "grid",
    //     transaction: 0.5,
    //     top: (contextEvent.containerPoint.y + 10).toString() + "px",
    //     left: (contextEvent.containerPoint.x + 10).toString() + "px"
    //   });
    // });
    //
    // $('#add-marker').on('click', function () {
    //   L.marker(FeaturesService.getCoordinates()).addTo(that.newMarkers);
    //
    //   $('.context-menu').fadeOut(100);
    // });
    //
    // $('#add-area-selector').on('click', function () {
    //   // TO DO
    //   $('.context-menu').fadeOut(100);
    // });
    //
    // $('#clear-layers').on('click', function () {
    //   that.featureGroups.forEach(layer => layer.clearLayers());
    //   $('.context-menu').fadeOut(100);
    // });
  }

}
