import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as Leaflet from 'leaflet';
import * as $ from 'jquery';
import {RestAdapterService} from "../../rest-adapter.service";
import {LAYER_NAME, MapsWrapper} from "../maps.wrapper";
import {OSMAddressNode} from "../../Ontologies";
import {DistributionService, Entry} from "../distribution.service";
import {CoordinatesService} from "../coordinates/coordinates.service";

@Component({
  selector: 'app-markers-popup',
  templateUrl: './markers-popup.component.html',
  styleUrls: ['./markers-popup.component.css']
})

export class MarkersPopupComponent implements OnInit,AfterViewInit {


  private _wrapper: MapsWrapper;
  private _map : Leaflet.Map;
  private _layers : Leaflet.LayerGroup;
  private _index : number[];

  private _user_defined: Leaflet.FeatureGroup;
  private _fetched: Leaflet.FeatureGroup;
  private _area_selected: Leaflet.FeatureGroup;
  private _geometry: Leaflet.FeatureGroup;

  latitude: number;
  longitude: number;
  country: string;
  region: string;
  county: string;
  town: string;
  place: string;
  road: string;

  constructor(private restService : RestAdapterService,
              private distributionService : DistributionService) {

    distributionService.subscribe(entry => {
      if (entry.key === MapsWrapper.name) {
        this._wrapper = entry.value as MapsWrapper;

        this._map = this._wrapper.map;
        this._layers = this._wrapper.layers;
        this._index = this._wrapper.index;

        this._user_defined = this._wrapper.layer(LAYER_NAME.USER_DEFINED);
        this._fetched = this._wrapper.layer(LAYER_NAME.FETCHED);
        this._area_selected = this._wrapper.layer(LAYER_NAME.AREA_SELECTED);
        this._geometry = this._wrapper.layer(LAYER_NAME.GEOMETRY);

        this._layers.getLayer(this._index["user-defined"])
          .on('click', this.displayMarkerPopUp);

        this._layers.getLayer(this._index["fetched"])
          .on('click', this.displayMarkerPopUp);

        this._layers.getLayer(this._index["area-selected"])
          .on('click', this.displayMarkerPopUp);

        console.log("Marker Popup Component Ready!")
      }
    });
  }

  ngOnInit() {
    // ToDo
  }

  ngAfterViewInit() {
    // ToDo
  }

  fadeMarkerPopUp = (click: Event) => {
    $('#marker-popup').fadeOut(300);
  };

  addComment = (click: Event) => {
    // ToDo
  };

  public displayMarkerPopUp =  (event) => {

    this.distributionService.submit(
      new Entry(CoordinatesService.ACTIONS.DISPLAY,
        new Entry(event.latlng, true )
      ));

    let
      lat = event.latlng.lat.toFixed(4),
      lng = event.latlng.lng.toFixed(4)
    ;

    if (event.latlng) {

      this.latitude = lat;
      this.longitude = lng;

      let marker_popup = $('#marker-popup');
      marker_popup.fadeIn(300);
      marker_popup.css({
        display: 'flex'
      });

      this.restService.getLocationInfo(lat, lng).subscribe((address: OSMAddressNode) => {

        this.country = address.country;
        this.region = address.region;
        this.county = address.county;
        this.town = address.town;
        this.place = address.place;
        this.road = address.road;
      });
    }
  }

}
