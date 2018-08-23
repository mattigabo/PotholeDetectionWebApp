import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LAYER_NAME, MapsWrapper} from "../maps.wrapper";
import * as $ from "jquery";
import * as Leaflet from 'leaflet';
import 'leaflet-draw';
import {CoordinatesComponent} from "../coordinates/coordinates.component";
import {RestAdapterService} from "../../rest-adapter.service";
import {Toast, ToasterService} from "angular2-toaster";
import {GeoCoordinates} from "../../Ontologies";
import {CoordinatesService} from "../coordinates/coordinates.service";
import {DistributionService, Entry} from "../distribution.service";

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit, AfterViewInit {

  private _wrapper: MapsWrapper;

  private _map: Leaflet.Map;
  private _layers: Leaflet.LayerGroup;
  private _index: number[];

  private _user_defined: Leaflet.FeatureGroup;
  private _fetched: Leaflet.FeatureGroup;
  private _area_selected: Leaflet.FeatureGroup;
  private _geometry: Leaflet.FeatureGroup;

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
              private distributionService: DistributionService) {

    distributionService.subscribe(entry => {
      if (entry.key === MapsWrapper.name) {
        this._wrapper = entry.value as MapsWrapper;

        this._map = this._wrapper.map;
        this._layers = this._wrapper.layers;
        this._index = this._wrapper.index;

        this._user_defined = this._wrapper.layer(LAYER_NAME.USER_DEFINED);
        this._fetched = this._wrapper.layer(LAYER_NAME.FETCHED);
        this._area_selected = this._wrapper.layer(LAYER_NAME.AREA_SELECTED);
        this._geometry = this._wrapper.layer(LAYER_NAME.GEOMETRY);

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

        this._geometry.on('contextmenu', (event) => {

          this._circleEditor.save();

        });

        this._map.on(Leaflet.Draw.Event.CREATED, (event : Leaflet.DrawEvents.Created) => {
          let type = event.layerType,
            circle = event.layer;
          if (type === "circle") {
            circle.addTo(this._geometry);

            this._circleID = this._geometry.getLayerId(circle)

            ContextMenuComponent.showRetrieveArea(event.target);
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

  }

  ngAfterViewInit() {

  }

  onMapContextMenuShowContextMenu = (event : Leaflet.LeafletMouseEvent) => {

    this.distributionService.submit(
      new Entry(CoordinatesService.ACTIONS.DISPLAY,
        new Entry(event.latlng, false)
      ));

    this.coordinatesService.coordinates = event.latlng;

    let
      top = (event.containerPoint.y + 10),
      left = (event.containerPoint.x + 10),
      contextMenu = $('.context-menu')
    ;

    contextMenu.css({
      display: "grid",
      transaction: 0.5,
      top: top.toString() + "px",
      left: left.toString() + "px"
    });

    console.log(left + contextMenu.width());

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

  };

  addMarker = (event : Event) => {
    let user_defined : Leaflet.FeatureGroup = this._layers.getLayer(this._index[LAYER_NAME.USER_DEFINED]) as Leaflet.FeatureGroup;
    Leaflet.marker(this.coordinatesService.coordinates).addTo(user_defined);
    ContextMenuComponent._addMarker(this.coordinatesService.coordinates, this.restService, this.toasterService);
    ContextMenuComponent.hideContextMenu(event)
  };

  addArea = (event : Event) => {

    // @ts-ignore
    this._circleEditor.disable();

    this._geometry.clearLayers();

    this._circleMaker.enable();

    ContextMenuComponent.hideContextMenu(event)
  };

  retrieveArea = (event: Event) => {
    // @ts-ignore
    this._circleEditor.disable();

    this._wrapper.layer(LAYER_NAME.GEOMETRY)
      .eachLayer((layer) => {
        let circle = layer as Leaflet.Circle;
        console.log(circle.getLatLng(), circle.getRadius());
      });

    $('#area-retrieve-icon').hide();

    $('#area-retrieve-item').hide();

    ContextMenuComponent.hideContextMenu(event);

    this.clearSelection(event);
  };

  clearSelection = (event : Event) => {
    // @ts-ignore
    this._circleEditor.disable();

    this._wrapper.layer(LAYER_NAME.GEOMETRY).clearLayers();

    ContextMenuComponent.hideRetrieveArea(event);
    ContextMenuComponent.hideContextMenu(event);

  };

  clearMarkers = (event : Event) => {
    this._wrapper.layer(LAYER_NAME.USER_DEFINED).clearLayers();
    this._wrapper.layer(LAYER_NAME.FETCHED).clearLayers();
    this._wrapper.layer(LAYER_NAME.AREA_SELECTED).clearLayers();

    ContextMenuComponent.hideContextMenu(event);
  };

  private static showRetrieveArea = (event?) => {
    $('#area-retrieve-icon').css({
      display: "flex"
    });

    $('#area-retrieve-item').css({
      display: "flex"
    });
  };

  private static hideRetrieveArea = (event?) => {
    $('#area-retrieve-icon').hide();
    $('#area-retrieve-item').hide();
  };

  public static hideContextMenu = (event) => {
    $('.context-menu').each((idx, obj) => $(obj).fadeOut(100));
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
}
