import { Component} from '@angular/core';
import * as $ from 'jquery';
import {RestAdapterService} from "../../services/rest/rest-adapter.service";
import {MapsWrapper} from "../../core/maps.wrapper";
import {DistributionService, Entry} from "../../services/distribution/distribution.service";
import {CoordinatesService} from "../../services/coordinates/coordinates.service";
import {Marker} from "../../ontologies/DataStructures";
import {WindowService} from "../../services/window/window.service";
import {Toast, ToasterService} from "angular2-toaster";
import {LngLat, RouteAPIResponse, Route, RouteServiceResponse} from "../../ontologies/RouteData";
import {LatLngLiteral} from "leaflet";
import {LatLng} from "leaflet";
import * as LeafletHeatLine from 'leaflet-hotline';
import {Custom, MediaTypes} from "../../core/custom";
import {HeatmapUpdater} from "../../core/heatmap-updater";


@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent extends HeatmapUpdater {

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

  private is_focused = false;

  country: string = "";
  region: string = "";
  county: string = "";
  town: string = "";
  road: string = "";
  origin: string = "";
  destination: string = "";
  radius: number = 100;

  constructor(private _restService : RestAdapterService,
              private _distService: DistributionService,
              private _toasterService: ToasterService,
              private _windower: WindowService) {

    super(_distService);

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

  private _toggleInput(source, brother) {
    let hidden_attr = brother.attr('hidden');

    if ((typeof hidden_attr !== typeof undefined || hidden_attr === true) &&
      source.val() !== undefined && source.val() !== "") {
      // console.log("Display");
      brother.attr('hidden', false);
    } else if (typeof hidden_attr === typeof undefined || hidden_attr === false) {
      if (source.val() == undefined || source.val() == "" || source.attr('hidden') !== undefined) {
        // console.log("Hide");
        brother.attr('hidden', true);
        // brother.val("")
      }
    }
  }

  displayRegion(event) {
    let brother = $("#filter-field--region");
    let source = $("#filter-field--country");

    this._toggleInput(source, brother);
    this.displayCounty(event);
  }

  displayCounty(event) {
    let brother = $("#filter-field--county");
    let source = $("#filter-field--region");

    this._toggleInput(source, brother);
    this.displayTown(event)
  }

  displayTown(event) {
    let brother = $("#filter-field--town");
    let source = $("#filter-field--county");

    this._toggleInput(source, brother);
    this.displayRoad(event)
  }

  displayRoad(event) {
    let brother = $("#filter-field--road");
    let source = $("#filter-field--town");

    this._toggleInput(source, brother);
  }

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
    // console.log("Focus:", event);
    if(window.matchMedia(MediaTypes.tablet.getMaxWidthMediaQuery()).matches) {
      let entry = $(event.target).parent().parent().parent().attr("id");
      this.is_focused = true;
      $(document).on('keyup', this._onEnterBlur($(event.target)));

      $(window).on('resize', this._onResizeBlur($(event.target)));

      $('#filters-nav--header').hide();
      if (entry === "filter-by-place") {
        $('#filter-by-route').hide();
        $('#layers-checkbox-group').hide();
      } else if (entry === "filter-by-route") {
        $('#filter-by-place').hide();
        $('#layers-checkbox-group').hide();
      }
    }
  };

  onInputBlur = (event) => {
    // console.log("Blur:", event);

    if(window.matchMedia(MediaTypes.tablet.getMaxWidthMediaQuery()).matches) {
      this.is_focused = false;
      $('#filters-nav--header').show();
      $('#filter-by-route').show();
      $('#filter-by-place').show();
      $('#layers-checkbox-group').show();
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

  togglePlaceFilters = (event) => {
    $('.filters-nav-form').each((idx, obj) => $(obj).hide(300));
    if(window.matchMedia(MediaTypes.tablet.getMaxWidthMediaQuery()).matches) {
      if (this.is_focused) {
        this.is_focused = false;
      }
    }
    this.toggle($('#filter-by-place-form'));
  };

  toggleRouteFilters = (event) => {
    $('.filters-nav-form').each((idx, obj) => $(obj).hide(300));
    if(window.matchMedia(MediaTypes.tablet.getMaxWidthMediaQuery()).matches) {
      if (this.is_focused) {
        this.is_focused = false;
      }
    }
    this.toggle($('#filter-by-route-form'))
  };

  private toggle (el) {
    if (el.css('display') === 'none') {
      el.css({display:'flex'}).hide().show(400);
    } else {
      el.hide(400);
    }
  }

  private addFetchedMarkersToLayer = (markers: Marker[]) => {
    let data : LatLng[] = markers.map(m => this.toLatLng(m.coordinates));
    this.populateLayer(data, this.fetched, Custom.fetchedMarker);
  };

  onClickFetchMarkersByPlace = ($event) => {

    this.closeFiltersNav();

    this._restService.getAllMarkers(this.country, this.region, this.county, this.town, this.road)
      .subscribe(markers => {
        let infoToast: Toast = {
          type: 'info',
          title: 'Server Response',
          body: "The server has founded n°" + markers.length + " potholes",
          showCloseButton: true
        };
        this._toasterService.pop(infoToast);
        this.addFetchedMarkersToLayer(markers);
      });
  };

  onClickFetchMarkersByRoute = ($event) => {

    this.closeFiltersNav();

    this._restService.getMarkerOnRouteByPlace(this.origin, this.destination, this.radius)
      .subscribe(response => {
        //this.fetchMarkers(response.content);
        console.log(response);
        this.drawRoutePath(response.content);
      });
  };

  onClickUndoFiltering = ($event) => {
    this.route_path.clearLayers();
    this.fetched.clearLayers();
  };

  public drawRoutePath(responseContent: RouteAPIResponse){

    this.route_path.clearLayers();

    let lngLats: LngLat[] = responseContent.routingServiceResponse.routes[0].geometry.coordinates,
        markers: Marker[] = responseContent.markers;

    this.addFetchedMarkersToLayer(markers);

    let hotLineData = this.createHotlineData(lngLats, markers);
    var routePathHotline = LeafletHeatLine.hotline(hotLineData, this.heatLineOptions);

    routePathHotline.bindPopup("Potholes founded along this route: " + markers.length +
       ". Route calculated by " + responseContent.routingServiceResponse.info.attribution);
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

    if(distances[0] == undefined){
      return this.heatLineOptions.max;
    }

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
