import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as Leaflet from 'leaflet';
import {RestAdapterService} from "../rest-adapter.service";
import {Marker} from "../ontologies";

import * as $ from "jquery";
import {LAYER_NAME, MapsWrapper} from "./maps.wrapper";
import {DistributionService} from "./distribution.service";
import {MapAddict} from "../map-addict";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent extends MapAddict{

  options = {
    zoomControl: false,
    center: new Leaflet.LatLng(44, 12),
    zoom: 10
  };

  constructor(private restService: RestAdapterService,
              private distributionService: DistributionService) {
    super();

    distributionService.subscribe((entry => {
      if (entry.key === MapsWrapper.name &&
          entry.value instanceof MapsWrapper) {

        super.init(entry.value);

        console.log("Map Component Ready!")
      }
    }));
  }

  ngOnInit() {

    this._wrapper = new MapsWrapper("osm-map", this.options, this.distributionService);

  }

  ngAfterViewInit(): void {
    this.restService.getAllMarkers()
      .subscribe((potholes: Marker[]) => {
          potholes.forEach((m: Marker) => {
            console.log("Marker drawing...");
            Leaflet.marker(m.coordinates).addTo(this._fetched);
          })
        }
      );
  }


}
