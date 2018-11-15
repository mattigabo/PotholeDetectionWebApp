import {Component, SecurityContext} from '@angular/core';
import * as $ from 'jquery';
import {RestAdapterService} from "../../services/rest/rest-adapter.service";
import {LAYER_NAME, MapsWrapper} from "../../core/maps.wrapper";
import {DistributionService, Entry} from "../../services/distribution/distribution.service";
import {CoordinatesService} from "../../services/coordinates/coordinates.service";
import {MapAddict} from "../../core/map-addict";
import {GeoCoordinates, Marker, MarkerComment, MarkerUpVote} from "../../ontologies/DataStructures";
import {DomSanitizer} from "@angular/platform-browser";
import {Toast, ToasterService} from "angular2-toaster";
import {WindowService} from "../../services/window/window.service";
import {MediaTypes} from "../../core/custom";
import {FingerprintService} from "../../services/fingerprint/fingerprint.service";
import {HttpErrorResponse} from "@angular/common/http";
import * as Leaflet from 'leaflet';

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

  confirmationLevel:number;

  isMobile: () => boolean = () => window.matchMedia(MediaTypes.tablet.getMaxWidthMediaQuery()).matches;
  // isUserDefined: () => boolean = () => this.wrapper.layerGroup(LAYER_NAME.USER_DEFINED)
  //   .hasLayer(new Leaflet.Marker([this.latitude, this.longitude]));

  _null = "'null'";

  constructor(private _restService : RestAdapterService,
              private _distributionService : DistributionService,
              private _sanitizer: DomSanitizer,
              private _toasterService: ToasterService,
              private _fingerprint: FingerprintService,
              private _windower: WindowService) {

    super();

    _distributionService.subscribe(entry => {
      if (entry.key === MapsWrapper.name &&
          entry.value instanceof MapsWrapper) {

        super.init(entry.value);

        this.user_defined.on('click', this.displayMarkerPopUp);

        this.fetched.on('click', this.displayMarkerPopUp);

        this.system_defined.on('click', this.displayMarkerPopUp);

        // this.user_position.on('click', this.displayMarkerPopUp);

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

  addComment = (click: Event) => {
    this._sanitizer.sanitize(SecurityContext.HTML, this.commentText);
    var mcomment: MarkerComment = new MarkerComment(this.markerId, this.commentText);

    this.sendComment(mcomment);
  };

  public displayMarkerPopUp =  (event) => {

    this._distributionService.submit(
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

      if (window.matchMedia(MediaTypes.tablet.getMaxWidthMediaQuery()).matches) {
        marker_popup.css({display: 'flex'}).hide().fadeIn(300)
        //.animate({
        //   height:"toggle",
        // }, 300, () => {
        //   $('.marker-popup-entry').each((idx, obj) => {
        //     $(obj).css({display: 'flex'}).hide().fadeIn(100);
        //   })
        // });
      } else {
        marker_popup.css({display: 'flex'}).hide().fadeIn(300);
      }

      let markerCoordinates: GeoCoordinates = new GeoCoordinates(lat, lng);
      this._restService.getMarkerAt(markerCoordinates).subscribe((marker: Marker) => {

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

        this.confirmationLevel = marker.nDetections;
      });
    }
  };

  hideMarkerPopup = (click: Event) => {
    let marker_popup = $('#marker-popup');

    if (!window.matchMedia(MediaTypes.tablet.getMaxWidthMediaQuery()).matches) {
      marker_popup.fadeOut(300);
    } else {
      // $('.marker-popup-entry').each((idx, obj) => {
      //   $(obj).hide();
      // });
      marker_popup.fadeOut(300);
        // .animate({height:"toggle"}, 500);
    }

    $(".marker-popup-text").each((idx, textarea) => {
      $(textarea).val('');
    });
  };

  private _onResizeBlur = (input) => (event) => {

    if (event.target.innerHeight >= this._windower.height) {
      input.blur();
    }
  };

  onFocusHideMarkerPopup = (event) => {
    if(window.matchMedia(MediaTypes.tablet.getMaxWidthMediaQuery()).matches){
      $("#marker-popup").fadeOut(200);
      $(event.target).blur();
      let stub = $("#text-stub");
      $("#comment-stub").fadeIn(200, () => stub.focus());
      $(window).on('resize', this._onResizeBlur(stub));
    }
  };

  onBlurDisplayMarkerPopup = ($event) => {
    if(window.matchMedia(MediaTypes.tablet.getMaxWidthMediaQuery()).matches){
      $("#comment-stub").fadeOut(300, () => {
        $("#marker-popup").fadeIn(300);
        $("#marker-popup-comment--text").val($("#text-stub").val());
      });
      $(window).off('resize', this._onResizeBlur);
    }
  };

  confirmPotholePresence = ($event) => {
    let successToast: Toast = {
      type: 'success',
      title: 'Pothole Confirmed',
      body: "Thanks, you have confirmed the Pothole presence!",
      showCloseButton: true
    };

    var upvote: MarkerUpVote = new MarkerUpVote(this.markerId, this._fingerprint.getGUID());

    this._restService.addUpVote(upvote,
      X =>  {
        this._toasterService.pop(successToast);
        this.confirmationLevel++;
      },
      err => {
        let httpError: HttpErrorResponse = (err as HttpErrorResponse)
        switch(httpError.status) {
          case 412:
            this._toasterService.pop( {
                type: 'info',
                title: 'Pothole not confirmed',
                body: "Already voted!",
                showCloseButton: true
              });
            break;
          case 500:
            this._toasterService.pop({
              type: 'error',
              title: 'Pothole not confirmed',
              body: "Error during the communication with the server",
              showCloseButton: true
            });
            break;
        }
      }
    );
  };

  private sendComment(comment: MarkerComment){

    let successToast: Toast = {
      type: 'success',
      title: 'Comment Added',
      body: "Comment successfully added to the pothole relative to Marker with ID: " + comment.markerId,
      showCloseButton: true
    };

    let errorToast: Toast = {
      type: 'error',
      title: 'Comment Not Added',
      body: "Error occured during the comment adding to the pothole relative to Marker with ID:" + comment.markerId,
      showCloseButton: true
    };

    this._restService.addComment(comment,
      X =>  this._toasterService.pop(successToast),
      err => this._toasterService.pop(errorToast),
    );
  }
}
