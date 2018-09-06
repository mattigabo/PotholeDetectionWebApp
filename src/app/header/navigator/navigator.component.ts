import { Component} from '@angular/core';
import * as $ from 'jquery';
import * as Leaflet from 'leaflet';
import {RestAdapterService} from "../../services/rest/rest-adapter.service";
import {MapsWrapper} from "../../maps/maps.wrapper";
import {DistributionService, Entry} from "../../services/distribution/distribution.service";
import {CoordinatesService} from "../../services/coordinates/coordinates.service";
import {MapAddict} from "../../map-addict";
import {Marker} from "../../ontologies/DataStructures";
import {marker} from "leaflet";
import {WindowService} from "../../services/window/window.service";
import {ToasterService} from "angular2-toaster";
import {LngLat, RouteAPIResponse, Route, RouteServiceResponse} from "../../ontologies/RouteData";
import {LatLngLiteral} from "leaflet";
import {LatLng} from "leaflet";
import * as LeafletHeatLine from 'leaflet-hotline';
import {Custom} from "../../custom";


@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent extends MapAddict {

  private heatLineOptions =  {
    min: 30,
    max: 350,
    palette: {
      0.0: '#ff0000',
      0.5: '#ffff00',
      1.0: '#008800'
    },
    weight: 5,
    outlineColor: '#000000',
    outlineWidth: 1,
    smoothFactor: 0
  };

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

  closeFiltersNav = (clickEvent? : Event) => {

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

  private addFetchedMarkersToLayer = (markers: Marker[]) => {
    let data : LatLng[] = markers.map(m => this.toLatLng(m.coordinates));
    this.populateLayer(data, this.fetched, Custom.serverMarker);
    // console.log(data);
    this._distService.submit(new Entry(MapsWrapper.ACTION.UPDATE_HEATMAP, data));
  };

  onClickFetchMarkersByPlace = ($event) => {
    let country = $('#filter-field--country').val(),
      region = $('#filter-field--region').val(),
      county = $('#filter-field--county').val(),
      town = $('#filter-field--town').val(),
      road = $('#filter-field--road').val();

    this.closeFiltersNav();

    this._restService.getAllMarkers(country, region, county, town, road)
      .subscribe(markers => this.addFetchedMarkersToLayer(markers));
  };


  onClickFetchMarkersByRoute = ($event) => {
    let origin = $('#filter-field--origin').val(),
      destination = $('#filter-field--destination').val(),
      radius = $('#filter-field--search-radius').val();

    this.closeFiltersNav();

    this._restService.getMarkerOnRouteByPlace(origin, destination, radius)
      .subscribe(response => {
        //this.fetchMarkers(response.content);
        console.log(response);
        this.drawRoutePath(response.content);
      });
  };

  public drawRoutePath(responseContent: RouteAPIResponse){

    this.route_path.clearLayers();

    let lngLats: LngLat[] = responseContent.routingServiceResponse.routes[0].geometry.coordinates,
        markers: Marker[] = responseContent.markers;

    this.addFetchedMarkersToLayer(markers);

    let hotLineData = this.createHotlineData(lngLats, markers);
    var routePathHotline = LeafletHeatLine.hotline(hotLineData, this.heatLineOptions);

    routePathHotline.bindPopup("Potholes founded along this route:" + markers.length +
      + " Route calculated by " + responseContent.routingServiceResponse.info.attribution);
    routePathHotline.addTo(this.route_path);
    // zoom the map to the polyline
    this.map.fitBounds(routePathHotline.getBounds());
  }

  private createHotlineData(lngLats: LngLat[], markers: Marker[]): number[][]{
    let latLngs: LatLngLiteral[] = this.generateLatLngLiteralsFormat(lngLats);
    var result:  number[][] = [];
    latLngs.forEach(value => {
      result.push([
        value.lat,
        value.lng,
        this.calculatePaletteColor(new LatLng(value.lat,value.lng), markers)
      ]);
    });
    console.log(result);
    return result;
  }

  private calculatePaletteColor(currPoint: LatLng, markers: Marker[]): number{
    var distances: number[] = markers.map(m => currPoint.distanceTo(new LatLng(m.coordinates.lat, m.coordinates.lng)))
      .sort((a,b) => a - b);
    console.log(distances);

    return distances[0];
  }

  private generateLatLngLiteralsFormat(lngLats: LngLat[]): LatLngLiteral[]{
    console.log(lngLats);
    var latLngs: LatLngLiteral[] = [];
    lngLats.forEach((value: LngLat) => {
      var formatCorrected: LatLngLiteral = { lat: value[1], lng: value[0] }
      latLngs.push(formatCorrected);
    });
    return latLngs;
  }

}
