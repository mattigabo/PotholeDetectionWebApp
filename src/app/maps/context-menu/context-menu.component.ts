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
import {Heatmap} from "../heatmap.overlay.wrapper";

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent extends MapAddict {

  private _heatmap : Heatmap.HeatLayer;

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

  constructor(private restService: RestAdapterService,
              private toasterService: ToasterService,
              private coordinatesService: CoordinatesService,
              private distService: DistributionService) {
    super();

    distService.subscribe(entry => {
      if (entry.key === MapsWrapper.name &&
          entry.value instanceof MapsWrapper) {

        super.init(entry.value as MapsWrapper);

        this._heatmap = Heatmap.heatOverlay();

        // @ts-ignore
        Leaflet.drawLocal.draw.handlers.circle.tooltip.start = "";
        // @ts-ignore
        Leaflet.drawLocal.edit.handlers.edit.tooltip.text = "";
        // @ts-ignore
        Leaflet.drawLocal.edit.handlers.edit.tooltip.subtext = "";

        this._circleMaker = new Leaflet.Draw.Circle(this._map, this._circleOptions);

        this._circleEditor = new Leaflet.EditToolbar.Edit(this._map, {
          // @ts-ignore
          featureGroup: this._geometry,
        });

        this._map.on('contextmenu', this.onMapContextMenuShowContextMenu);
        this._route_path.on('contextmenu', this.onMapContextMenuShowContextMenu);

        this._geometry.on('contextmenu', (event) => {

          this._circleEditor.save();

        });

        this._map.on(Leaflet.Draw.Event.CREATED, (event : Leaflet.DrawEvents.Created) => {
          let type = event.layerType,
            circle = event.layer;
          if (type === "circle") {

            ContextMenuComponent.showRetrieveArea(event.target);

            circle.addTo(this._geometry);

            this._circleID = this._geometry.getLayerId(circle);

          }
        });

        this._map.on(Leaflet.Draw.Event.DRAWSTOP, (event : Leaflet.DrawEvents.DrawStop) => {
          this._circleMaker.disable();
          // @ts-ignore
          this._circleEditor.enable();
        });

        this._map.on(Leaflet.Draw.Event.EDITMOVE, (event: Leaflet.DrawEvents.EditStart) => {
          ContextMenuComponent.hideContextMenu(event.target)
        });

        this._map.on(Leaflet.Draw.Event.EDITRESIZE, (event: Leaflet.DrawEvents.EditStart) => {
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

    this.distService.submit(
      new Entry(CoordinatesService.ACTIONS.DISPLAY,
        new Entry(event.latlng, false)
      ));

    this.coordinatesService.coordinates = event.latlng;

    let contextMenu = $('.context-menu');

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

      if (top + contextMenu.height() > $(window).height()) {
        top -= (contextMenu.height() + 20);
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

    let user_defined : Leaflet.FeatureGroup = this._layers.getLayer(this._index[LAYER_NAME.USER_DEFINED]) as Leaflet.FeatureGroup;
    Leaflet.marker(this.coordinatesService.coordinates).addTo(user_defined);
    ContextMenuComponent._addMarker(this.coordinatesService.coordinates, this.restService, this.toasterService);
  }

  addArea(event : Event) {

    ContextMenuComponent.hideContextMenu(event);

    // @ts-ignore
    this._circleEditor.disable();

    this._geometry.clearLayers();

    this._circleMaker.enable();
  }

  retrieveArea(event: Event){

    ContextMenuComponent.hideContextMenu(event);

    // @ts-ignore
    this._circleEditor.disable();

    this._wrapper.layer(LAYER_NAME.GEOMETRY)
      .eachLayer((layer) => {
        let circle = layer as Leaflet.Circle,
            gc = new GeoCoordinates(
              circle.getLatLng().lat,
              circle.getLatLng().lng
            );
        this.restService.getAllMarkersInTheArea(gc, circle.getRadius())
          .subscribe(markers => {
            markers
              .map(m => m.coordinates)
              .map(c => Leaflet.marker([c.lat, c.lng]))
              .forEach(m => this._area_selected.addLayer(m))
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
    ContextMenuComponent.hideRetrieveArea(event);

    // @ts-ignore
    this._circleEditor.disable();

    this._wrapper.layer(LAYER_NAME.GEOMETRY).clearLayers();

  }

  clearMarkers(event : Event){

    ContextMenuComponent.hideContextMenu(event);

    this._wrapper.layer(LAYER_NAME.USER_DEFINED).clearLayers();
    this._wrapper.layer(LAYER_NAME.FETCHED).clearLayers();
    this._wrapper.layer(LAYER_NAME.AREA_SELECTED).clearLayers();
  }

  clearAll(event: Event) {
    this._wrapper.clearAll();
  }

  displayHeatMap(event) {

    ContextMenuComponent.hideContextMenu(event);

    $('.toggle').each((idx, obj) => {
      $(obj).toggle(300);
    });

    let heat_data : Heatmap.HeatData[] = [];

    this._map.eachLayer(layer => {
      if (layer instanceof Leaflet.Marker) {
        console.log("pushing ${0} in heatmap", layer.getLatLng());
        heat_data.push({latlng: layer.getLatLng(), radius: 1})
      }
    });

    this.hideAllMarkers();

    this._heatmap.setData(heat_data).addTo(this._layers);
  }

  displayMarkers(event) {
    ContextMenuComponent.hideContextMenu(event);

    $('.toggle').each((idx, obj) => {
      $(obj).toggle(300);
    });

    this._layers.removeLayer(this._heatmap as Heatmap.HeatLayer);
    this.showAllMarkers();
  }

  private static showRetrieveArea(event?) {
    $('#area-retrieve-icon').css({
      display: "flex"
    });

    $('#area-retrieve-item').css({
      display: "flex"
    });
  };

  private static hideRetrieveArea(event?) {
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
    this._layers.addLayer(this._user_defined);
    this._index[LAYER_NAME.USER_DEFINED] = this._layers.getLayerId(this._user_defined);
  }

  private showAreaSelectedMarkers(){
    this._layers.addLayer(this._area_selected);
    this._index[LAYER_NAME.AREA_SELECTED] = this._layers.getLayerId(this._area_selected);
  }

  private showFetchedMarkers(){
    this._layers.addLayer(this._fetched);
    this._index[LAYER_NAME.FETCHED] = this._layers.getLayerId(this._fetched);
  }

  private hideAllMarkers(){

    this.hideUserDefinedMarkers();
    this.hideFetchedMarkers();
    this.hideAreaSelectedMarkers();
  }

  private hideUserDefinedMarkers() {
    this._layers.removeLayer(this._user_defined);
  }

  private hideFetchedMarkers() {
    this._layers.removeLayer(this._fetched);
  }

  private hideAreaSelectedMarkers() {
    this._layers.removeLayer(this._area_selected);
  }

}
