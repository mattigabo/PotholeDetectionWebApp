import {Component} from '@angular/core';
import {LAYER_NAME, MapsWrapper} from "../../core/maps.wrapper";
import * as $ from "jquery";
import * as Leaflet from 'leaflet';
import 'leaflet-draw';
import {RestAdapterService} from "../../services/rest/rest-adapter.service";
import {Toast, ToasterService} from "angular2-toaster";
import {CoordinatesService} from "../../services/coordinates/coordinates.service";
import {DistributionService, Entry} from "../../services/distribution/distribution.service";
import {Coordinates, CURequest, GeoCoordinates} from "../../ontologies/DataStructures";
import {heatLayer, HeatOptions, HeatLayer} from "../../core/heat.layer";
import {Custom, MediaTypes} from "../../core/custom";
import {latLng, LatLng, LatLngExpression, Layer} from "leaflet";
import {HeatmapUpdater} from "../../core/heatmap-updater";
import {FingerprintService} from "../../services/fingerprint/fingerprint.service";

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent extends HeatmapUpdater {

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
              private _fingerprint: FingerprintService,
              private _distService: DistributionService) {
    super(_distService);

    _distService.subscribe(entry => {
      if (entry.key === MapsWrapper.name &&
          entry.value instanceof MapsWrapper) {

        super.init(entry.value as MapsWrapper);

        this._heatLayer = heatLayer().setOptions(this._heatmapOptions);

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
        this.geometry.on('contextmenu', (event) => {this._circleEditor.save();});

        this.map.on(Leaflet.Draw.Event.CREATED, (event : Leaflet.DrawEvents.Created) => {
          let type = event.layerType,
            circle = event.layer;
          if (type === "circle") {

            ContextMenuComponent._showRetrieveArea(event.target);
            ContextMenuComponent._showClearSelection(event.target);
            ContextMenuComponent._hideSelectArea(event.target);

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

      } else if (entry.key === MapsWrapper.ACTION.UPDATE_HEATMAP
        && this._heatLayer.isVisible) {

        console.log("updating heatmap");

        let activeMarkers = this.getActiveMarkersCoordinates();
        // console.log(activeMarkers)
        this._heatLayer.display(activeMarkers)
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

    if (!window.matchMedia(MediaTypes.tablet.getMaxWidthMediaQuery()).matches) {

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

  public static hideContextMenu (event?) {

    let context_menu = $(".context-menu");

    if (context_menu.css("display") !== "none") {
      if (!window.matchMedia(MediaTypes.tablet.getMaxWidthMediaQuery()).matches) {
        context_menu.each((idx, obj) => $(obj).hide());
      } else {
        context_menu.each((idx, obj) => $(obj).animate({height:'toggle'}, 500));
        $('.col').each((idx, obj) => {$(obj).hide()});
      }
    }

  };

  onClickAddUserMarker(event : Event) {

    ContextMenuComponent.hideContextMenu(event);

    let geoCoordinates = new GeoCoordinates(
      this._coordinatesService.coordinates.lat,
      this._coordinatesService.coordinates.lng
    );

    let marker_request = new CURequest<Coordinates>(
      this._fingerprint.getGUID(),
      geoCoordinates.toCoordinates()
    );

    this._restService.addMarker(marker_request,
      X => this.onUserMarkerAdded([geoCoordinates.lat, geoCoordinates.lng]),
      err => this.onUserMarkerNotAdded(),
    );
  }

  onClickAddAreaSelector(event : Event) {

    ContextMenuComponent.hideContextMenu(event);

    // @ts-ignore
    this._circleEditor.disable();

    this.geometry.clearLayers();

    this._circleMaker.enable();
  }

  retrieveArea(event: Event){

    let data: LatLng[] = [];

    this.geometry.eachLayer((layer) => {
        let circle = layer as Leaflet.Circle,
            gc = new GeoCoordinates(
              circle.getLatLng().lat,
              circle.getLatLng().lng
            );
        this._restService.getAllMarkersInTheArea(gc, circle.getRadius())
          .subscribe(markers => {
            data = markers.map(m => this.toLatLng(m.coordinates));
            this.populateLayer(data, this.fetched, Custom.fetchedMarker);
          });
      });

    $('#area-retrieve-icon').hide();
    $('#area-retrieve-item').hide();

    this.clearSelection(event);
  }

  clearSelection(event? : Event) {
    ContextMenuComponent.hideContextMenu(event);
    ContextMenuComponent._hideRetrieveArea(event.target);
    ContextMenuComponent._hideClearSelection(event.target);
    ContextMenuComponent._showSelectArea(event.target);
    // @ts-ignore
    this._circleEditor.disable();
    this.geometry.clearLayers();
  }

  clearMarkers(event? : Event){

    ContextMenuComponent.hideContextMenu(event);
    this.fetched.clearLayers();
    this.user_defined.clearLayers();
    if (this._heatLayer.isVisible) {
      this._heatLayer.display([]);
    }
  }

  clearAll(event?: Event) {

    ContextMenuComponent.hideContextMenu(event);
    if (this._heatLayer.isVisible) {
      this.displayMarkers(event)
    }
    this.wrapper.clearAll();
  }

  displayHeatMap(event) {

    ContextMenuComponent.hideContextMenu(event);
    $('.toggle').each((idx, obj) => {
      $(obj).toggle(300);

    });

    super.initHeatMap(this._heatLayer);

    super.updateHeatMap(this._heatLayer);

  }

  displayMarkers(event) {
    ContextMenuComponent.hideContextMenu(event);

    $('.toggle').each((idx, obj) => {$(obj).toggle(300);});

    this.heat_group
      .removeLayer(this._heatLayer.clear());

    this._distService.submit(new Entry(MapsWrapper.ACTION.LAYERS_DISPLAY, LAYER_NAME.FETCHED));
    this._distService.submit(new Entry(MapsWrapper.ACTION.LAYERS_DISPLAY, LAYER_NAME.USER_DEFINED));
    this._distService.submit(new Entry(MapsWrapper.ACTION.LAYERS_DISPLAY, LAYER_NAME.SYSTEM_DEFINED));
  }

  private getActiveMarkersCoordinates() : LatLng[] {
    let coordinates : Leaflet.LatLng[] = [];

    let extractPoints: (layer:Layer) => void = layer => {
      if (layer instanceof Leaflet.Marker) {
        // console.log("pushing %s in heat_group", layer.getLatLng().toString());
        let c = layer.getLatLng();
        coordinates.push(latLng(c.lat, c.lng, 1.0))
      }
    };

    if(!this.isDefaultHidden){
      this.system_defined.eachLayer(extractPoints);
    }
    if(!this.isUserHidden){
      this.user_defined.eachLayer(extractPoints);
    }
    if(!this.isFetchedHidden){
      this.fetched.eachLayer(extractPoints);
    }

    return coordinates;
  }

  private static _showRetrieveArea(target?: EventTarget) {
    $('#area-retrieve-icon').css({
      display: "flex"
    });

    $('#area-retrieve-item').css({
      display: "flex"
    });
  };

  private static _showClearSelection(target?: EventTarget) {
    $('#clear-selection-icon').css({
      display: "flex"
    });

    $('#clear-selection-item').css({
      display: "flex"
    });
  };

  private static _showSelectArea(target?: EventTarget) {
    $('#area-select-icon').css({
      display: "flex"
    });

    $('#area-select-item').css({
      display: "flex"
    });
  }

  private static _hideRetrieveArea(target?: EventTarget) {
    $('#area-retrieve-icon').hide();
    $('#area-retrieve-item').hide();
  };

  private static _hideClearSelection(target?: EventTarget) {
    $('#clear-selection-icon').hide();
    $('#clear-selection-item').hide();
  }

  private static _hideSelectArea(target?: EventTarget) {
    $('#area-select-icon').hide();
    $('#area-select-item').hide();
  }

  private onUserMarkerAdded(coordinates: LatLngExpression){

    Custom.userMarker(coordinates).addTo(this.user_defined);

    this._distService.submit(
      new Entry(MapsWrapper.ACTION.UPDATE_HEATMAP, coordinates)
    );

    let successToast: Toast = {
      type: 'success',
      title: 'Marker Added',
      body: "Marker successfully added",
      showCloseButton: true
    };

    this._toasterService.popAsync(successToast);
  }

  private onUserMarkerNotAdded(){

    let errorToast: Toast = {
      type: 'error',
      title: 'Marker Not Added',
      body: "Error occured during the marker adding! Please retry...",
      showCloseButton: true
    };

    this._toasterService.pop(errorToast);
  }
}
