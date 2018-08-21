import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import * as $ from 'jquery';
import {RestAdapterService} from "../../rest-adapter.service";
import {MapSingleton} from "../map-singleton";
import {CoordinatesComponent} from "../coordinates/coordinates.component";
import {OSMAddressNode} from "../../Ontologies";

@Component({
  selector: 'app-markers-popup',
  templateUrl: './markers-popup.component.html',
  styleUrls: ['./markers-popup.component.css']
})

export class MarkersPopupComponent implements OnInit,AfterViewInit {

  private osmMap : L.Map;
  private layers : L.LayerGroup;
  private index : number[];


  latitude: number
  longitude: number
  country: string;
  region: string;
  county: string;
  town: string;
  place: string;
  road: string;

  constructor(private restService : RestAdapterService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.osmMap = MapSingleton.instance.map;
    this.layers = MapSingleton.instance.layers;
    this.index = MapSingleton.instance.index;

    this.layers.getLayer(this.index["user-defined"])
      .on('click', this.displayMarkerPopUp);

    this.layers.getLayer(this.index["fetched"])
      .on('click', this.displayMarkerPopUp);

    this.layers.getLayer(this.index["area-selected"])
      .on('click', this.displayMarkerPopUp);
  }

  fadeMarkerPopUp = (click: Event) => {
    $('#marker-popup').fadeOut(300);
  };

  addComment = (click: Event) => {
    // ToDo
  };

  public displayMarkerPopUp =  (event) => {

    CoordinatesComponent.showCoordinates(event.latlng);

    let
      lat = event.latlng.lat.toFixed(4).toString(),
      lng = event.latlng.lng.toFixed(4).toString()
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
