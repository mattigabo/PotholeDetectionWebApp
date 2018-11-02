import * as Leaflet from 'leaflet';
import {DistributionService, Entry} from "../services/distribution/distribution.service";
import {Toast, ToasterService} from "angular2-toaster";
import {LayerGroup} from "leaflet";
import {HeatLayer} from "./heat.layer";

export enum LAYER_NAME {
  TILES = "map-box-tiles",
  FETCHED = "fetched",
  USER_DEFINED = "user-defined",
  // AREA_SELECTED = "area-selected",
  GEOMETRIES = "geometries",
  HEAT_MAPS = "heat-maps",
  ROUTE_PATHS = "route-paths",
  SYSTEM_DEFINED = "system-defined"
}

export class MapsWrapper {

  private _user_is_hidden = false;
  private _system_defined_is_hidden = false;
  private _fetched_is_hidden = false;
  private _route_is_hidden = false;

  public static ACTION = {
    CLEAR_LAYERS: "CLEAR_LAYERS",
    UPDATE_HEATMAP: "UPDATE_HEATMAP",
    LAYERS_DISPLAY: "LAYERS_DISPLAY",
    HEATMAP_DISPLAY: "HEATMAP_DISPLAY",
    HIDE_LAYER: "HIDE_LAYER",
    HIDE_ALL_LAYERS: "HIDE_ALL_LAYERS",
    UNCHECK_SYSTEM_LAYER: "UNCHECK_SYSTEM_LAYER"
  };

  private _map : Leaflet.Map;
  private _index : number[] = [];
  private _layers : Leaflet.LayerGroup;

  public get map(): Leaflet.Map { return this._map}
  public get layers() : Leaflet.LayerGroup {return this._layers}
  public get index() : number[] { return this._index}


  get user_is_hidden(): boolean {
    return this._user_is_hidden;
  }
  get system_defined_is_hidden(): boolean {
    return this._system_defined_is_hidden;
  }
  get fetched_is_hidden(): boolean {
    return this._fetched_is_hidden;
  }
  get route_is_hidden(): boolean {
    return this._route_is_hidden;
  }
  set fetched_is_hidden(value: boolean) {
    this._fetched_is_hidden = value;
  }
  set system_defined_is_hidden(value: boolean) {
    this._system_defined_is_hidden = value;
  }
  set user_is_hidden(value: boolean) {
    this._user_is_hidden = value;
  }
  set route_is_hidden(value: boolean){
    this._route_is_hidden = value;
  }

  constructor(private _map_id : string,
              private _options : Leaflet.MapOptions,
              private _emitter: DistributionService,
              private _toasterService: ToasterService) {

    this._layers = Leaflet.layerGroup();

    this.add(LAYER_NAME.TILES, Leaflet.tileLayer(
      'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | ' +
          '&copy; <a href="https://www.mapbox.com/">Mapbox</a> | ' +
          '<a href="https://www.linkedin.com/in/alessandro-cevoli/">Xander</a>&' +
          '<a href="https://www.linkedin.com/in/matteogabellini/">Gabe</a>',
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoicHVtcGtpbnNoZWFkIiwiYSI6ImNqa2NuM3l2cDFzdGYzcXA4MmoyZ2dsYWsifQ.FahVhmZj5RODSwGjl5-EaQ'
      })
    );

    Object.values(LAYER_NAME)
      .filter(x => x != LAYER_NAME.TILES)
      .forEach(layer => {
        this.add(layer, Leaflet.featureGroup());
      });

    _options["layers"] = [this._layers];

    this._map = Leaflet.map(_map_id, _options);

    this._map.on('locationerror', this.onLocationError);

    this._map.on('locationfound', this.onLocationFound);

    //this._map.locate({setView: true, enableHighAccuracy: true});

    this._map.whenReady(() => {
      _emitter.submit(new Entry<string, any>(MapsWrapper.name, this))
    });

    console.log("Map Wrapper Instance Ready!");

  }

  public layer<T extends Leaflet.Layer>(id: string, from? : string | LayerGroup) : T {
    let group = (from === undefined) ? this.layers :
      (from instanceof LayerGroup) ? from : this.layerGroup(from);

    return group.getLayer(this.index[id]) as T;
  }

  public readonly featureGroup = (id:string) : Leaflet.FeatureGroup => this.layer(id);
  public readonly layerGroup = (id:string) : Leaflet.LayerGroup => this.layer(id);
  public readonly tileLayer = (id:string) : Leaflet.TileLayer => this.layer(id);
  public readonly heatLayer = (id:string) : HeatLayer => this.layer(id, LAYER_NAME.HEAT_MAPS);

  public add<T extends Leaflet.Layer>(id : string, layer: T, to?: string | LayerGroup) : MapsWrapper {

    let
      group = (to === undefined) ? this.layers :
        (to instanceof LayerGroup) ? to : this.layerGroup(to),
      group_id = (to === undefined) ? "master" :
        (to instanceof LayerGroup) ? group.getLayerId(layer as T) : id;

    group.addLayer(layer as T);
    this._index[id] = group.getLayerId(layer as T);
    console.log("Added layer %s to %s @ index %d", id, group_id, this._index[id]);

    return this;
  }

  public remove<T extends Leaflet.Layer>(layer: T | number) {
    this._layers.removeLayer(layer);
  }

  public clearAll() {
    this._layers.getLayers()
      .filter(l => l instanceof LayerGroup)
      .forEach(lg => {
        (lg as LayerGroup).clearLayers()
      });
  }

  private onLocationFound(event : Leaflet.LocationEvent) {

    this._toasterService.pop({
      type: 'info',
      title: 'User Location',
      body: "User found @["+
        event.latlng.lat.toFixed(4) + " N, " +
        event.latlng.lng.toFixed(4) + " E" +
        "]!",
      showCloseButton: true
    });
  }

  private onLocationError(event: Leaflet.LocationEvent) {
    this._toasterService.pop({
      type: 'error',
      title: 'User Location',
      body: "Couldn't establish user position!",
      showCloseButton: true
    });
  }
}

