import {AfterViewInit, Component, OnInit} from '@angular/core';
import L from 'leaflet';
import {RestAdapterService} from "../rest-adapter.service";
import {Marker} from "../Ontologies";

import * as $ from "jquery";
// import {CoordinatesOverlay} from "./coordinates/coordinates-overlay";
// import {MarkersPopup} from "./markers-popup/markers-popup";
import {from} from "rxjs";
import {LAYER_NAME, MapSingleton} from "../map-singleton";

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

    $(document).ready(() => {

      MapSingleton.instance().init();

      this.osmMap = MapSingleton.instance().map();
      this.layers = MapSingleton.instance().layers();
      this.index = MapSingleton.instance().index();

      let user_defined : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.USER_DEFINED]);
      let fetched : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.FETCHED]);
      let area_selected : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.AREA_SELECTED]);
      let geometry : L.LayerGroup = this.layers.getLayer(this.index[LAYER_NAME.GEOMETRY]);

      // let cm = new ContextMenu(this.osmMap, user_defined, fetched, area_selected);
      // let co = new CoordinatesOverlay(this.osmMap);

      console.log("Map Component Ready!")
    });

  }

  ngAfterViewInit(): void {
    this.restService.getAllMarkers()
      .subscribe( (potholes: Marker[]) =>  {
          potholes.forEach((m: Marker) => {
            let fetched = this.layers.getLayer(this.index[LAYER_NAME.FETCHED]);
            L.marker(m.coordinates).addTo(fetched);
          })
        }
      );
  }
}
