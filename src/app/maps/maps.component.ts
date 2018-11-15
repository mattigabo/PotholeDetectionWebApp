import {Component} from '@angular/core';
import * as Leaflet from 'leaflet';
import {RestAdapterService} from "../services/rest/rest-adapter.service";
import {Marker} from "../ontologies/DataStructures";

import {MapsWrapper} from "../core/maps.wrapper";
import {DistributionService} from "../services/distribution/distribution.service";
import {MapAddict} from "../core/map-addict";
import {ToasterService} from "angular2-toaster";
import {Custom} from "../core/custom";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent extends MapAddict{

  options = {
    zoomControl: false,
    center: new Leaflet.LatLng(44, 12),
    zoom: 8,
    minZoom: 5,
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
          .subscribe(
            (potholes: Marker[]) => {
              this.populateLayer(
                potholes.map(m => this.toLatLng(m.coordinates)),
                this.system_defined,
                Custom.serverMarker
              );
            },
            error => {
              this.toasterService.pop({
                type: 'error',
                title: 'Marker loading error',
                body: "Error during the communication with the server",
                showCloseButton: true
              })
            }
          );

        console.log(this.layers);
        this.refreshIfNotOnChrome()
      }
    });

  }

  ngOnInit() {
    new MapsWrapper("osm-map", this.options, this.distService, this.restService, this.toasterService);
  }

  ngAfterViewInit(): void {
  }

  private refreshIfNotOnChrome(){
    if(!(/Chrome/.test(navigator.appVersion))) {
      this.map.invalidateSize()
      this.map.invalidateSize()
    }
  }
}
