import { Component, OnInit } from '@angular/core';
import L from 'leaflet';
import {RestAdapterService} from "../rest-adapter.service";
import {Marker} from "../Ontologies";

import * as $ from "jquery";
import {ContextMenu} from "./context-menu/context-menu";
import {CoordinatesOverlay} from "./coordinates/coordinates-overlay";
import {MarkersPopup} from "./markers-popup/markers-popup"
import {Toast, ToasterService} from "angular2-toaster";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  public static osmMap : L.Map;
  private featureGroups = [];

  constructor(private restService: RestAdapterService, private toasterService: ToasterService) {
    // L.Control.zoomControl = false;
  }

  ngOnInit() {

    let that = this;

    $("#osm-map").ready(readyEvent => {

      MapsComponent.osmMap = L.map('osm-map', {
        zoomControl: false
      });

      MapsComponent.osmMap = MapsComponent.osmMap.setView([44, 12], 10);

      let osmMap : L.Map = MapsComponent.osmMap;

      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | ' +
          '&copy; <a href="https://www.mapbox.com/">Mapbox</a> | ' +
          '<a href="https://www.linkedin.com/in/alessandro-cevoli/">Xander</a>&' +
          '<a href="https://www.linkedin.com/in/matteogabellini/">Gabe</a>',
        maxZoom: 20,
        minZoom: 5,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoicHVtcGtpbnNoZWFkIiwiYSI6ImNqa2NuM3l2cDFzdGYzcXA4MmoyZ2dsYWsifQ.FahVhmZj5RODSwGjl5-EaQ'
      }).addTo(osmMap);

      let users_defined : L.FeatureGroup = L.featureGroup();
      let fetched = L.featureGroup();
      let area_selected = L.featureGroup();

      area_selected.addTo(osmMap);
      fetched.addTo(osmMap);
      users_defined.addTo(osmMap);

      let cm = new ContextMenu(osmMap, users_defined, fetched, area_selected, this.restService, this.toasterService);
      let co = new CoordinatesOverlay(osmMap);
      let mp = new MarkersPopup(osmMap,
    [users_defined, fetched, area_selected]);

      that.restService.getAllMarkers()
        .subscribe( (potholes: Marker[]) =>  {
            potholes.forEach((m: Marker) => {
              L.marker(m.coordinates).addTo(fetched);
            })
          }
        );
    });
  }
}
