import {Component, SecurityContext} from '@angular/core';
import * as $ from 'jquery';
import {RestAdapterService} from "../../rest-adapter.service";
import {MapsWrapper} from "../maps.wrapper";
import {DistributionService, Entry} from "../distribution.service";
import {CoordinatesService} from "../coordinates/coordinates.service";
import {MapAddict} from "../../map-addict";
import {GeoCoordinates, Marker, MarkerComment} from "../../ontologies";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-markers-popup',
  templateUrl: './markers-popup.component.html',
  styleUrls: ['./markers-popup.component.css']
})

export class MarkersPopupComponent extends MapAddict{

  commentText:string;

  markerId:number;
  latitude: number;
  longitude: number;
  country: string;
  region: string;
  county: string;
  town: string;
  place: string;
  road: string;

  constructor(private restService : RestAdapterService,
              private distributionService : DistributionService,
              private sanitizer: DomSanitizer) {

    super();

    distributionService.subscribe(entry => {
      if (entry.key === MapsWrapper.name &&
          entry.value instanceof MapsWrapper) {

        super.init(entry.value);

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
    this.sanitizer.sanitize(SecurityContext.HTML, this.commentText);
    var comment: MarkerComment;

    comment.comment = this.commentText
    //this.restService.addComment()
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

      let markerCoodinates: GeoCoordinates = new GeoCoordinates(lat, lng);
      this.restService.getMarkerAt(markerCoodinates).subscribe((marker: Marker) => {

        this.markerId = marker.id;
        this.country = marker.addressNode.country;
        this.region = marker.addressNode.region;
        this.county = marker.addressNode.county;
        this.town = marker.addressNode.town;
        this.place = marker.addressNode.place;
        this.road = marker.addressNode.road;
      });
    }
  }

}
