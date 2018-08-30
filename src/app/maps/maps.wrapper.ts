import * as Leaflet from 'leaflet';
import {DistributionService, Entry} from "../services/distribution/distribution.service";

export enum LAYER_NAME {
  OSM = "osm-map",
  MAP_BOX = "map-box",
  MASTER = "master",
  FETCHED = "fetched",
  USER_DEFINED = "user-defined",
  AREA_SELECTED = "area-selected",
  GEOMETRY = "geometry",
  HEAT_MAP = "heat-map"
}

export class MapsWrapper {

  public static ACTION = {
    CLEAR: "CLEAR",
  };

  private _map : Leaflet.Map;
  private _index : number[] = [];
  private _layers : Leaflet.LayerGroup;

  public get map(): Leaflet.Map { return this._map}
  public get layers() : Leaflet.LayerGroup {return this._layers}
  public get index() : number[] { return this._index}

  constructor(map_id : string, options : Leaflet.MapOptions, emitter: DistributionService) {

      let mapbox = Leaflet.tileLayer(
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | ' +
            '&copy; <a href="https://www.mapbox.com/">Mapbox</a> | ' +
            '<a href="https://www.linkedin.com/in/alessandro-cevoli/">Xander</a>&' +
            '<a href="https://www.linkedin.com/in/matteogabellini/">Gabe</a>',
          minZoom: 5,
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoicHVtcGtpbnNoZWFkIiwiYSI6ImNqa2NuM3l2cDFzdGYzcXA4MmoyZ2dsYWsifQ.FahVhmZj5RODSwGjl5-EaQ'
        });

      let user_defined : Leaflet.FeatureGroup = Leaflet.featureGroup();
      let fetched : Leaflet.FeatureGroup = Leaflet.featureGroup();
      let area_selected : Leaflet.FeatureGroup = Leaflet.featureGroup();
      let geometry : Leaflet.FeatureGroup = Leaflet.featureGroup();

      this._layers =
        Leaflet.layerGroup([mapbox, user_defined, fetched, area_selected, geometry]);

      options["layers"] = [this._layers];

      this._map = Leaflet.map(map_id, options);

      this._map.on('locationerror', () => {
        alert("Couldn't establish user position!");
      });

      this._map.on('locationfound', (event : Leaflet.LocationEvent) => {
        // this._map.setView(event.latlng, options.zoom);
        alert("User found @["+
          event.latlng.lat.toFixed(4) + " N, " +
          event.latlng.lng.toFixed(4) + " E" +
          "]!");
      });

      this._map.locate({setView: true, enableHighAccuracy: true});

      this._index[LAYER_NAME.MAP_BOX] = this.layers.getLayerId(mapbox);
      this._index[LAYER_NAME.AREA_SELECTED] = this.layers.getLayerId(area_selected);
      this._index[LAYER_NAME.FETCHED] = this.layers.getLayerId(fetched);
      this._index[LAYER_NAME.USER_DEFINED] = this.layers.getLayerId(user_defined);
      this._index[LAYER_NAME.GEOMETRY] = this.layers.getLayerId(geometry);

      this._map.whenReady(() => {
        emitter.submit(new Entry<string, any>(MapsWrapper.name, this))
      });

      console.log("Map Wrapper Instance Ready!");

  }

  public layer (id: string) : Leaflet.FeatureGroup{
    return this.layers.getLayer(this.index[id]) as Leaflet.FeatureGroup;
  }

  public clearAll() {
    this.layer(LAYER_NAME.AREA_SELECTED).clearLayers();
    this.layer(LAYER_NAME.FETCHED).clearLayers();
    this.layer(LAYER_NAME.USER_DEFINED).clearLayers();
  }
}

