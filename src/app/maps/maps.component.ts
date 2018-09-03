import {Component} from '@angular/core';
import * as Leaflet from 'leaflet';
import {RestAdapterService} from "../services/rest/rest-adapter.service";
import {Marker} from "../ontologies/DataStructures";

import {MapsWrapper} from "./maps.wrapper";
import {DistributionService} from "../services/distribution/distribution.service";
import {MapAddict} from "../map-addict";
import {LatLngExpression} from "leaflet";
import {ToasterService} from "angular2-toaster";

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
              private distService: DistributionService,
              private toasterService: ToasterService) {
    super();

    distService.subscribe(entry => {
      if (entry.key === MapsWrapper.name &&
          entry.value instanceof MapsWrapper) {

        super.init(entry.value);

        console.log("Map Component Ready!");

        this.restService.getAllMarkers()
          .subscribe((potholes: Marker[]) => {
            console.log(potholes);
            potholes.map(m => m.coordinates)
              .forEach(c => {
                  console.log("Marker drawing...", c);
                  Leaflet.marker([c.lat, c.lng]).addTo(this._fetched);
                })
          });
      }
    });

    distService.subscribe(entry => {
      if (entry.value === MapsWrapper.ACTION.CLEAR) {
        this._wrapper.clearAll();
      }
    });

  }

  ngOnInit() {

    this._wrapper = new MapsWrapper("osm-map", this.options, this.distService, this.toasterService);

  }

  ngAfterViewInit(): void {

  }
}
