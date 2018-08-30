import { Component} from '@angular/core';
import * as $ from 'jquery';
import * as Leaflet from 'leaflet';
import {RestAdapterService} from "../../rest-adapter.service";
import {MapsWrapper} from "../../maps/maps.wrapper";
import {DistributionService, Entry} from "../../maps/distribution.service";
import {CoordinatesService} from "../../maps/coordinates/coordinates.service";
import {MapAddict} from "../../map-addict";
import {Marker} from "../../ontologies";
import {marker} from "leaflet";

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent extends MapAddict{

  constructor(private _restService : RestAdapterService,
              private _distService: DistributionService) {

    super();

    _distService.subscribe(entry => {
      if (entry.key === MapsWrapper.name &&
        entry.value instanceof MapsWrapper) {

        super.init(entry.value);

        console.log("Navigator Component Ready!");
      }
    });

    $('#filter-by-place-send-button').on('click', function () {


    });

    $('#filter-by-route-send-button').on('click', function () {

    });

  }

  ngOnInit() {

  }

  closeFiltersNav = (clickEvent : Event) => {

    this._distService.submit(new Entry(CoordinatesService.ACTIONS.HIDE_ALL, true));

    $('#filters-nav--header').hide();

    $('.filters-nav--entry').each((idx, obj) => {
      $(obj).hide();
    });

    $('#filters-nav').animate({
      width:'toggle',
      // display: 'none'
    }, 500, () => {
      $('#filters-button').fadeIn(100);
    });
  };

  private toggle (el) {
    if (el.css('display') === 'none') {
      el.show(300, () => {
        el.css({display:'flex'});
      });
    } else {
      el.hide(300);
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
