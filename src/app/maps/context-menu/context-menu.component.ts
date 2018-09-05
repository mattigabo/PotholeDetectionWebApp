import {Component} from '@angular/core';
import {LAYER_NAME, MapsWrapper} from "../maps.wrapper";
import * as $ from "jquery";
import * as Leaflet from 'leaflet';
import 'leaflet-draw';
import {RestAdapterService} from "../../services/rest/rest-adapter.service";
import {Toast, ToasterService} from "angular2-toaster";
import {CoordinatesService} from "../../services/coordinates/coordinates.service";
import {DistributionService, Entry} from "../../services/distribution/distribution.service";
import {GeoCoordinates} from "../../ontologies/DataStructures";
import {MapAddict} from "../../map-addict";
// import {Heatmap} from "../heat_group.overlay.wrapper";
// import "leaflet.area/dist/leaflet-area.js"
import {heatLayer, HeatOptions, HeatLayer} from "../heat.layer";

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent extends MapAddict {

  private _heatLayer : HeatLayer;

  private _circleMaker: Leaflet.Draw.Circle;
  private _circleEditor: Leaflet.EditToolbar.Edit;

  private _circleID : number;

  private _circleOptions = {
    shapeOptions: {
      color: 'red'
    },
    metric: true,
    showRadius: true,
  };

  private _heatmapOptions : HeatOptions = {
    minOpacity: 0.5,
    // maxZoom: 5,
    max: 1.0,
    radius: 25,
    blur: 15,
    gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
  };

  constructor(private _restService: RestAdapterService,
              private _toasterService: ToasterService,
              private _coordinatesService: CoordinatesService,
              private _distService: DistributionService) {
    super();

    _distService.subscribe(entry => {
      if (entry.key === MapsWrapper.name &&
          entry.value instanceof MapsWrapper) {

        super.init(entry.value as MapsWrapper);

        this._heatLayer = heatLayer().setOptions(this._heatmapOptions);
        this.heat_group.addLayer(this._heatLayer);

        // @ts-ignore
        Leaflet.drawLocal.draw.handlers.circle.tooltip.start = "";
        // @ts-ignore
        Leaflet.drawLocal.edit.handlers.edit.tooltip.text = "";
        // @ts-ignore
        Leaflet.drawLocal.edit.handlers.edit.tooltip.subtext = "";

        this._circleMaker = new Leaflet.Draw.Circle(this.map, this._circleOptions);

        this._circleEditor = new Leaflet.EditToolbar.Edit(this.map, {
          // @ts-ignore
          featureGroup: this.geometry,
        });

        this.map.on('contextmenu', this.onMapContextMenuShowContextMenu);
        this.route_path.on('contextmenu', this.onMapContextMenuShowContextMenu);

        this.geometry.on('contextmenu', (event) => {

          this._circleEditor.save();

        });

        this.map.on(Leaflet.Draw.Event.CREATED, (event : Leaflet.DrawEvents.Created) => {
          let type = event.layerType,
            circle = event.layer;
          if (type === "circle") {

            ContextMenuComponent._showRetrieveArea(event.target);

            circle.addTo(this.geometry);

            this._circleID = this.geometry.getLayerId(circle);

          }
        });

        this.map.on(Leaflet.Draw.Event.DRAWSTOP, (event : Leaflet.DrawEvents.DrawStop) => {
          this._circleMaker.disable();
          // @ts-ignore
          this._circleEditor.enable();
        });

        this.map.on(Leaflet.Draw.Event.EDITMOVE, (event: Leaflet.DrawEvents.EditStart) => {
          ContextMenuComponent.hideContextMenu(event.target)
        });

        this.map.on(Leaflet.Draw.Event.EDITRESIZE, (event: Leaflet.DrawEvents.EditStart) => {
          ContextMenuComponent.hideContextMenu(event.target)
        });

        console.log("Context Menu Component Ready!");
      }
    });
  }

  ngOnInit() {
      super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  onMapContextMenuShowContextMenu = (event : Leaflet.LeafletMouseEvent) => {

    this._distService.submit(
      new Entry(CoordinatesService.ACTIONS.DISPLAY,
        new Entry(event.latlng, false)
      ));

    this._coordinatesService.coordinates = event.latlng;

    let contextMenu = $('#map-context-menu');

    if (!window.matchMedia("(max-width: 480px)").matches) {

      let
        top = (event.containerPoint.y + 10),
        left = (event.containerPoint.x + 10);

      contextMenu.css({
        display: "grid",
        top: top.toString() + "px",
        left: left.toString() + "px"
      }).hide();

      if (left + contextMenu.width() > $(window).width()) {
        left -= (contextMenu.width() + 20);
        contextMenu.css({
          left: left.toString() + "px"
        });
      }

      if (top + contextMenu.height()/2 > $(window).height()) {
        top -= (contextMenu.height()/2 + 20);
        contextMenu.css({
          top: top.toString() + "px"
        });
      }

      contextMenu.fadeIn(200);
    } else {

      contextMenu.css({display:"grid"}).hide().animate({
        height:'toggle'
      }, 500, () => {
        $('.col').each((idx, obj) => {$(obj).css({display:"flex"})});
      });

    }
  };

  public static hideContextMenu (event) {
    if (!window.matchMedia("(max-width: 480px)").matches) {
      $('.context-menu').each((idx, obj) => $(obj).hide());
    } else {
      $('.context-menu').each((idx, obj) => $(obj).animate({height:'toggle'}, 500));
      $('.col').each((idx, obj) => {$(obj).hide()});
    }
  };

  addMarker(event : Event) {

    ContextMenuComponent.hideContextMenu(event);

    let user_defined : Leaflet.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.USER_DEFINED]) as Leaflet.FeatureGroup;
    Leaflet.marker(this._coordinatesService.coordinates).addTo(user_defined);
    ContextMenuComponent._addMarker(this._coordinatesService.coordinates, this._restService, this._toasterService);
  }

  addArea(event : Event) {

    ContextMenuComponent.hideContextMenu(event);

    // @ts-ignore
    this._circleEditor.disable();

    this.geometry.clearLayers();

    this._circleMaker.enable();
  }

  retrieveArea(event: Event){

    ContextMenuComponent.hideContextMenu(event);

    // @ts-ignore
    this._circleEditor.disable();

    this.geometry.eachLayer((layer) => {
        let circle = layer as Leaflet.Circle,
            gc = new GeoCoordinates(
              circle.getLatLng().lat,
              circle.getLatLng().lng
            );
        this._restService.getAllMarkersInTheArea(gc, circle.getRadius())
          .subscribe(markers => {
            markers
              .map(m => m.coordinates)
              .map(c => Leaflet.marker([c.lat, c.lng]))
              .forEach(m => this.area_selected.addLayer(m))
          });
      });

    $('#area-retrieve-icon').hide();
    $('#area-retrieve-item').hide();

    this.hideAllMarkers();
    this.showAreaSelectedMarkers();

    this.clearSelection(event);
  }

  clearSelection(event : Event) {
    ContextMenuComponent.hideContextMenu(event);
    ContextMenuComponent._hideRetrieveArea(event);

    // @ts-ignore
    this._circleEditor.disable();

    this.geometry.clearLayers();

  }

  clearMarkers(event : Event){

    ContextMenuComponent.hideContextMenu(event);

    this.user_defined.clearLayers();
    this.fetched.clearLayers();
    this.area_selected.clearLayers();
  }

  clearAll(event: Event) {
    this.wrapper.clearAll();
  }

  displayHeatMap(event) {

    ContextMenuComponent.hideContextMenu(event);

    $('.toggle').each((idx, obj) => {
      $(obj).toggle(300);
    });

    let heat_data : Leaflet.LatLng[] = [];

    this.map.eachLayer(layer => {
      if (layer instanceof Leaflet.Marker) {
        console.log("pushing %s in heat_group", layer.getLatLng().toString());
        let c = layer.getLatLng();
        heat_data.push(Leaflet.latLng(c.lat, c.lng, 1.0))
      }
    });

    this.hideAllMarkers();

    this._heatLayer.setLatLngs(heat_data);
  }

  displayMarkers(event) {
    ContextMenuComponent.hideContextMenu(event);

    $('.toggle').each((idx, obj) => {
      $(obj).toggle(300);
    });

    this._heatLayer.setLatLngs([]);
    this.showAllMarkers();
  }

  private static _showRetrieveArea(event?) {
    $('#area-retrieve-icon').css({
      display: "flex"
    });

    $('#area-retrieve-item').css({
      display: "flex"
    });
  };

  private static _hideRetrieveArea(event?) {
    $('#area-retrieve-icon').hide();
    $('#area-retrieve-item').hide();
  };

  private static _addMarker(coordinates, restService: RestAdapterService, toasterService: ToasterService){
    let infoToast: Toast = {
      type: 'info',
      title: 'Prova',
      body: "Marker successfully added",
      showCloseButton: true
    };

    // toasterService.pop(infoToast);

    let successToast: Toast = {
      type: 'success',
      title: 'Marker Added',
      body: "Marker successfully added",
      showCloseButton: true
    };

    let errorToast: Toast = {
      type: 'error',
      title: 'Marker Not Added',
      body: "Error occured during the marker adding",
      showCloseButton: true
    };

    let geoCoordinates: GeoCoordinates = new GeoCoordinates(coordinates.lat, coordinates.lng);
    restService.addMarker(geoCoordinates,
      X =>  toasterService.pop(successToast),
      err => toasterService.pop(errorToast),
    );
  }

  private showAllMarkers(){
    this.showUserDefinedMarkers();
    this.showAreaSelectedMarkers();
    this.showFetchedMarkers();
  }

  private showUserDefinedMarkers(){
    this.wrapper.add(LAYER_NAME.USER_DEFINED, this.user_defined);
  }

  private showAreaSelectedMarkers(){
    this.wrapper.add(LAYER_NAME.AREA_SELECTED,this.area_selected);
  }

  private showFetchedMarkers(){
    this.wrapper.add(LAYER_NAME.FETCHED, this.fetched);
  }

  private hideAllMarkers(){

    this.hideUserDefinedMarkers();
    this.hideFetchedMarkers();
    this.hideAreaSelectedMarkers();
  }

  private hideUserDefinedMarkers() {
    this.layers.removeLayer(this.user_defined);
  }

  private hideFetchedMarkers() {
    this.layers.removeLayer(this.fetched);
  }

  private hideAreaSelectedMarkers() {
    this.layers.removeLayer(this.area_selected);
  }

}
