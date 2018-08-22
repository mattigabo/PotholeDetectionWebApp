import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {RestAdapterService} from "../rest-adapter.service";
import {Marker} from "../Ontologies";

import * as $ from "jquery";
import {LAYER_NAME, MapSingleton} from "./map-singleton";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, AfterViewInit {

  private osmMap : L.Map;
  private index : number[] = [];
  private layers : L.LayerGroup;

  constructor(private restService: RestAdapterService) {}

  ngOnInit() {
    MapSingleton.instance.initMap();

    this.osmMap = MapSingleton.instance.map;
    this.layers = MapSingleton.instance.layers;
    this.index = MapSingleton.instance.index;

    let user_defined = MapSingleton.instance.layer(LAYER_NAME.USER_DEFINED);
    let fetched = MapSingleton.instance.layer(LAYER_NAME.FETCHED);
    let area_selected = MapSingleton.instance.layer(LAYER_NAME.AREA_SELECTED);
    let geometry = MapSingleton.instance.layer(LAYER_NAME.GEOMETRY);

    console.log("Map Component Ready!")
  }

  ngAfterViewInit(): void {
    this.restService.getAllMarkers()
      .subscribe((potholes: Marker[]) => {
          potholes.forEach((m: Marker) => {
            console.log("Marker drawing...")
            let fetched = MapSingleton.instance.layer(LAYER_NAME.FETCHED);
            L.marker(m.coordinates).addTo(fetched);
          })
        }
      );
  }
}
