import { Component} from '@angular/core';
import * as $ from 'jquery';
import * as Leaflet from 'leaflet';
import {RestAdapterService} from "../../rest-adapter.service";
import {MapsWrapper} from "../../maps/maps.wrapper";
import {DistributionService, Entry} from "../../maps/distribution.service";
import {CoordinatesService} from "../../maps/coordinates/coordinates.service";
import {MapAddict} from "../../map-addict";
import {Marker} from "../../ontologies";

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent extends MapAddict{

  constructor(private restService : RestAdapterService,
              private distributionService: DistributionService) {

    super();

    distributionService.subscribe(entry => {
      if (entry.key === MapsWrapper.name &&
        entry.value instanceof MapsWrapper) {

        super.init(entry.value);

        $('#filter-by-place-send-button').on('click', function () {

          let country = $('#filter-field--country').val(),
            region = $('#filter-field--region').val(),
            county = $('#filter-field--county').val(),
            town = $('#filter-field--town').val(),
            road = $('#filter-field--road').val();

          let that = this;

          restService.getAllMarkers(country, region, county, town, road)
            .subscribe(markers => that.addFetchedMarkersToMap(markers));
        });

        $('#filter-by-route-send-button').on('click', function () {
          let origin = $('#filter-field--origin').val(),
            destination = $('#filter-field--destination').val(),
            radius = $('#filter-field--search-radius').val();

          let that = this;

          restService.getMarkerInThePath(origin, destination, radius)
            .subscribe(markers => that.addFetchedMarkersToMap(markers));
        });

        console.log("Navigator Component Ready!");
      }
    });

  }

  ngOnInit() {

  }

  closeFiltersNav = (clickEvent : Event) => {

    this.distributionService.submit(new Entry(CoordinatesService.ACTIONS.HIDE_ALL, true));

    $('#filters-nav--header').hide();

    $('.filters-nav--entry').each((idx, obj) => {
      $(obj).hide();
    });

    $('#filters-nav').animate({
      width:"toggle",
      display: "none"
    }, 500, () => {
      $('#filters-button').fadeIn(100);
    });
  };

  displayPlaceFilters = (event) => {
    $('#filter-by-route-form').hide(300);

    this.toggle($('#filter-by-place-form'));
  };

  displayRouteFilters = (event) => {
    $('#filter-by-place-form').hide(300);

    this.toggle($('#filter-by-route-form'))
  };



  private toggle (el) {
    if (el.css('display') === "none") {
      el.show(300, () => {
        el.css({display:"flex"});
      });
    } else {
      el.hide(300);
    }
  }

  private addFetchedMarkersToMap(markers: Marker[]) {
    this._fetched.clearLayers();
    markers.forEach(marker => {
      Leaflet.marker([marker.coordinates.lat, marker.coordinates.lng])
        .addTo(this._fetched);
    })
  }

}
