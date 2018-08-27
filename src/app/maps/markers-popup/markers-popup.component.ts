import {Component, SecurityContext} from '@angular/core';
import * as L from 'leaflet';
import * as $ from 'jquery';
import {RestAdapterService} from "../../rest-adapter.service";
import {LAYER_NAME, MapsWrapper} from "../maps.wrapper";
import {DistributionService, Entry} from "../distribution.service";
import {CoordinatesService} from "../coordinates/coordinates.service";
import {MapAddict} from "../../map-addict";
import {MarkerComment, OSMAddressNode} from "../../Ontologies";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-markers-popup',
  templateUrl: './markers-popup.component.html',
  styleUrls: ['./markers-popup.component.css']
})

export class MarkersPopupComponent extends MapAddict{

  commentText:string;

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
