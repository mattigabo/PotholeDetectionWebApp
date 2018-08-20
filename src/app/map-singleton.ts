import L from 'leaflet';

export enum LAYER_NAME {
  OSM = "osm-map",
  MAP_BOX = "map-box",
  MASTER = "master",
  FETCHED = "fetched",
  USER_DEFINED = "user-defined",
  AREA_SELECTED = "area-selected",
  GEOMETRY = "geometry",
}

export class MapSingleton {

  private osmMap : L.Map;
  private layerGroupsIndex : number[] = [];
  private masterLayer : L.LayerGroup;
  private static _isCreated : boolean = false;
  private static _isInit : boolean = false;
  private static _INSTANCE : MapSingleton = new MapSingleton();

  public static instance : () => MapSingleton = () => MapSingleton._INSTANCE;
  public static isCreated : () => boolean = () => MapSingleton._isCreated;
  public static isInit : () => boolean = () => MapSingleton._isCreated;

  public map : () => L.Map = () => this.osmMap;
  public layers : () => L.LayerGroup = () => this.masterLayer;
  public index : () => number[] = () => this.layerGroupsIndex;

  private constructor() {

    if (!MapSingleton._isCreated) {
      MapSingleton._INSTANCE = this;
      MapSingleton._isCreated = true;
    }

    return MapSingleton._INSTANCE;
  }

  init(options = {
    zoomControl: false,
    center: new L.LatLng(44, 12),
    zoom: 10
  }) {

    let that = this;

    if (!MapSingleton._isInit) {
      let mapbox = L.tileLayer(
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | ' +
            '&copy; <a href="https://www.mapbox.com/">Mapbox</a> | ' +
            '<a href="https://www.linkedin.com/in/alessandro-cevoli/">Xander</a>&' +
            '<a href="https://www.linkedin.com/in/matteogabellini/">Gabe</a>',
          maxZoom: 20,
          minZoom: 5,
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoicHVtcGtpbnNoZWFkIiwiYSI6ImNqa2NuM3l2cDFzdGYzcXA4MmoyZ2dsYWsifQ.FahVhmZj5RODSwGjl5-EaQ'
        });

      let user_defined : L.FeatureGroup = L.featureGroup();
      let fetched : L.FeatureGroup = L.featureGroup();
      let area_selected : L.FeatureGroup = L.featureGroup();
      let geometry : L.LayerGroup = L.layerGroup();

      that.masterLayer =
        L.layerGroup([mapbox, user_defined, fetched, area_selected, geometry]);

      options["layers"] = that.masterLayer;

      console.log(options);

      that.osmMap = L.map('osm-map', options);

      that.layerGroupsIndex[LAYER_NAME.OSM] = that.osmMap._leaflet_id;

      that.layerGroupsIndex[LAYER_NAME.MASTER] = that.masterLayer._leaflet_id;

      that.layerGroupsIndex[LAYER_NAME.MAP_BOX] = mapbox._leaflet_id;

      that.layerGroupsIndex[LAYER_NAME.AREA_SELECTED] = area_selected._leaflet_id;

      that.layerGroupsIndex[LAYER_NAME.FETCHED] = fetched._leaflet_id;

      that.layerGroupsIndex[LAYER_NAME.USER_DEFINED] = user_defined._leaflet_id;

      that.layerGroupsIndex[LAYER_NAME.GEOMETRY] = geometry._leaflet_id;

      console.log("Map Singleton Ready!");

      MapSingleton._isInit = true;

    }
  }
}

