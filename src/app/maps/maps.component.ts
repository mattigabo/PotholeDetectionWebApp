import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as Leaflet from 'leaflet';
import {RestAdapterService} from "../rest-adapter.service";
import {Marker} from "../Ontologies";

import * as $ from "jquery";
import {LAYER_NAME, MapsWrapper} from "./maps.wrapper";
import {DistributionService} from "./distribution.service";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, AfterViewInit {

  private _wrapper: MapsWrapper;
  private _map : Leaflet.Map;
  private _index : number[] = [];
  private _layers : L.LayerGroup;

  options = {
    zoomControl: false,
    center: new Leaflet.LatLng(44, 12),
    zoom: 10
  };

  private _user_defined: Leaflet.FeatureGroup;
  private _fetched: Leaflet.FeatureGroup;
  private _area_selected: Leaflet.FeatureGroup;
  private _geometry: Leaflet.FeatureGroup;

  constructor(private restService: RestAdapterService,
              private distributionService: DistributionService) {
    distributionService.subscribe((entry => {
      if (entry.key === MapsWrapper.name) {

        this._map = this._wrapper.map;
        this._layers = this._wrapper.layers;
        this._index = this._wrapper.index;

        this._user_defined = this._wrapper.layer(LAYER_NAME.USER_DEFINED);
        this._fetched = this._wrapper.layer(LAYER_NAME.FETCHED);
        this._area_selected = this._wrapper.layer(LAYER_NAME.AREA_SELECTED);
        this._geometry = this._wrapper.layer(LAYER_NAME.GEOMETRY);

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
