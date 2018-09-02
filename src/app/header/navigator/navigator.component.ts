import { Component} from '@angular/core';
import * as $ from 'jquery';
import * as Leaflet from 'leaflet';
import {RestAdapterService} from "../../services/rest/rest-adapter.service";
import {MapsWrapper} from "../../maps/maps.wrapper";
import {DistributionService, Entry} from "../../services/distribution/distribution.service";
import {CoordinatesService} from "../../services/coordinates/coordinates.service";
import {MapAddict} from "../../map-addict";
import {Marker} from "../../ontologies";
import {marker} from "leaflet";
import {WindowService} from "../../services/window/window.service";
import {ToasterService} from "angular2-toaster";

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent extends MapAddict {

  constructor(private _restService : RestAdapterService,
              private _distService: DistributionService,
              private _toaster: ToasterService,
              private _windower: WindowService) {

    super();

    _distService.subscribe(entry => {
      if (entry.key === MapsWrapper.name &&
        entry.value instanceof MapsWrapper) {

        super.init(entry.value);
        console.log(_windower.height, _windower.width);

        console.log("Navigator Component Ready!");
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  private _onEnterBlur = (input) => (keyEvent : KeyboardEvent) => {
    let key = keyEvent.key ? keyEvent.key.toUpperCase() : keyEvent.which;

    if (key == "ENTER") {
      input.blur();
    }
  };

  private _onResizeBlur = (input) => (event) => {
    if (event.target.innerHeight >= this._windower.height) {
      input.blur()
    }
  };

  onInputFocus = (event) => {
    console.log("Focus:", event);
    if(window.matchMedia('(max-width:480px)').matches) {
      let entry = $(event.target).parent().parent().parent().attr("id");

      $(document).on('keyup', this._onEnterBlur($(event.target)));

      $(window).on('resize', this._onResizeBlur($(event.target)));

      $('#filters-nav--header').hide();
      if (entry === "filter-by-place") {
        $('#filter-by-route').hide();
      } else {
        $('#filter-by-place').hide();
      }
    }
  };

  onInputBlur = (event) => {
    console.log("Blur:", event);

    if(window.matchMedia("(max-width:480px)").matches) {

      $('#filters-nav--header').show();
      $('#filter-by-route').show();
      $('#filter-by-place').show();
      $(document).off('keyup', this._onEnterBlur);
      $(window).off('resize', this._onResizeBlur);
    }
  };

  closeFiltersNav = (clickEvent : Event) => {

    this._distService.submit(new Entry(CoordinatesService.ACTIONS.HIDE_ALL, true));

    $('#filters-nav--header').hide();

    $('#filters-nav--entries').hide();

    $('#filters-nav').animate({
      width:'toggle',
      // display: 'none'
    }, 500, () => {
      $('#filters-button').fadeIn(100);
    });
  };

  private toggle (el) {
    if (el.css('display') === 'none') {
      el.css({display:'flex'}).hide().show(300);
    } else {
      el.hide(300);
      el.removeClass("active");
    }
  }

  displayPlaceFilters = (event) => {
    $('#filter-by-route-form').hide(300);

    this.toggle($('#filter-by-place-form'));
  };

  displayRouteFilters = (event) => {
    $('#filter-by-place-form').hide(300);

    this.toggle($('#filter-by-route-form'))
  };

  private fetchMarkers = (markers: Marker[]) => {
    this._distService.submit(
      new Entry<string, MapsWrapper>(MapsWrapper.ACTION.CLEAR, this._wrapper)
    );
    markers
      .map(m => m.coordinates)
      .map(c => Leaflet.marker([c.lat, c.lng]))
      .forEach(m => this._fetched.addLayer(m));
  };

  onClickFetchMarkersByPlace = ($event) => {
    let country = $('#filter-field--country').val(),
      region = $('#filter-field--region').val(),
      county = $('#filter-field--county').val(),
      town = $('#filter-field--town').val(),
      road = $('#filter-field--road').val();

    this._restService.getAllMarkers(country, region, county, town, road)
      .subscribe(markers => this.fetchMarkers(markers));
  };


  onClickFetchMarkersByRoute = ($event) => {
    let origin = $('#filter-field--origin').val(),
      destination = $('#filter-field--destination').val(),
      radius = $('#filter-field--search-radius').val();

    this._restService.getMarkerOnRouteByPlace(origin, destination, radius)
      .subscribe(markers => this.fetchMarkers(markers));
  };

}
