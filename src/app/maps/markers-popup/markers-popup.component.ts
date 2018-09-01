import {Component, SecurityContext} from '@angular/core';
import * as $ from 'jquery';
import {RestAdapterService} from "../../rest-adapter.service";
import {MapsWrapper} from "../maps.wrapper";
import {DistributionService, Entry} from "../distribution.service";
import {CoordinatesService} from "../coordinates/coordinates.service";
import {MapAddict} from "../../map-addict";
import {GeoCoordinates, Marker, MarkerComment} from "../../ontologies/DataStructures";
import {DomSanitizer} from "@angular/platform-browser";
import {Toast, ToasterService} from "angular2-toaster";

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
  city: string;
  town: string;
  place: string;
  road: string;
  suburb: string;
  district: string;

  constructor(private restService : RestAdapterService,
              private distributionService : DistributionService,
              private sanitizer: DomSanitizer,
              private toasterService: ToasterService) {

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
    var mcomment: MarkerComment = new MarkerComment(this.markerId, this.commentText)

    this.sendComment(mcomment);
  };

  public displayMarkerPopUp =  (event) => {

    this.distributionService.submit(
      new Entry(CoordinatesService.ACTIONS.DISPLAY,
        new Entry(event.latlng, true )
      ));

    let
      lat = event.latlng.lat.toFixed(7),
      lng = event.latlng.lng.toFixed(7)
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

        this.city = marker.addressNode.city;
        this.suburb = marker.addressNode.suburb;
        this.district = marker.addressNode.district;
      });
    }
  }

  private sendComment(comment: MarkerComment){

    let successToast: Toast = {
      type: 'success',
      title: 'Comment Added',
      body: "Comment successfully added to the Marker with ID: " + comment.markerId,
      showCloseButton: true
    };

    let errorToast: Toast = {
      type: 'error',
      title: 'Comment Not Added',
      body: "Error occured during the comment adding to the Marker with ID:" + comment.markerId,
      showCloseButton: true
    };

    this.restService.addComment(comment,
      X =>  this.toasterService.pop(successToast),
      err => this.toasterService.pop(errorToast),
    );
  }
}
