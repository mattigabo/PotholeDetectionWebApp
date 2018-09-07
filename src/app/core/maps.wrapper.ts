import * as Leaflet from 'leaflet';
import {DistributionService, Entry} from "../services/distribution/distribution.service";
import {Toast, ToasterService} from "angular2-toaster";
import {LayerGroup} from "leaflet";

export enum LAYER_NAME {
  MAP_BOX = "map-box",
  FETCHED = "fetched",
  USER_DEFINED = "user-defined",
  // AREA_SELECTED = "area-selected",
  GEOMETRY = "geometry",
  HEAT_MAP = "heat-map",
  ROUTE_PATH = "route-path"
}

export class MapsWrapper {

  public static ACTION = {
    CLEAR_LAYER: "CLEAR_LAYER",
    UPDATE_HEATMAP: "UPDATE_HEATMAP",
  };

  private _map : Leaflet.Map;
  private _index : number[] = [];
  private _layers : Leaflet.LayerGroup;

  public get map(): Leaflet.Map { return this._map}
  public get layers() : Leaflet.LayerGroup {return this._layers}
  public get index() : number[] { return this._index}

  constructor(private _map_id : string,
              private _options : Leaflet.MapOptions,
              private _emitter: DistributionService,
              private _toasterService: ToasterService) {

    this._layers = Leaflet.layerGroup();

    this.add(LAYER_NAME.MAP_BOX, Leaflet.tileLayer(
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
      .filter(x => x != LAYER_NAME.MAP_BOX)
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

  public layer<T extends Leaflet.Layer>(id: string) : T {
    return this.layers.getLayer(this.index[id]) as T;
  }

  public readonly featureGroup = (id:string) : Leaflet.FeatureGroup => this.layer(id);

  public readonly tileLayer = (id:string) : Leaflet.TileLayer => this.layer(id);

  public add<T extends Leaflet.Layer>(id : string, layer: T) : MapsWrapper {

    this._layers.addLayer(layer as T);
    this._index[id] = this._layers.getLayerId(layer as T);
    console.log("Added layer %s to master @ index %d", id, this._index[id]);
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
    // this.featureGroup(LAYER_NAME.AREA_SELECTED).clearLayers();
    // this.featureGroup(LAYER_NAME.FETCHED).clearLayers();
    // this.featureGroup(LAYER_NAME.USER_DEFINED).clearLayers();
    // this.featureGroup(LAYER_NAME.ROUTE_PATH).clearLayers();
    // this.featureGroup(LAYER_NAME.GEOMETRY).clearLayers();
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

