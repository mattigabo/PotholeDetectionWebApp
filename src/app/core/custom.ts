import * as Leaflet from "leaflet";
import {LatLngExpression, PointExpression} from "leaflet";

interface Offset{
  left:string;
  top:string;
}
export class Custom {

  // private static readonly defaultSize : string = '1rem';

  // public static readonly userColor : string = '#86cbff';
  // public static readonly serverColor: string = '#87cd78';
  // public static readonly fetchedColor: string = '#ff8f83';
  // public static readonly positionColor: string = '#ee00ee';
  //
  // public static readonly defaultBorderColor: string = '#222222';
  //
  // private static readonly userMarkerBorderValue: string = '2px solid ' + Custom.defaultBorderColor;
  // private static readonly serverMarkerBorderValue: string = '2px solid ' + Custom.defaultBorderColor;
  // private static readonly fetchedMarkerBorderValue: string = '3px solid ' + Custom.defaultBorderColor;
  // private static readonly positionMarkerBorderValue: string = '2px solid ' + Custom.defaultBorderColor;
  //
  // private static readonly defaultBorderRadius: string = '' + Custom.defaultSize + ' '  + Custom.defaultSize + ' 0';
  // private static readonly userPositionBorderRadius: string = Custom.defaultSize;
  //
  // private static readonly fetchedMarkerOffset: Offset = { left: '-1.15em', top: '-1.15em' };
  // private static readonly defaultMarkerOffset: Offset = { left: '-1.0em', top: '-1.0em' };


  private static readonly positionMarkerAnchor: PointExpression = [12, 12];
  private static readonly iconAnchor : PointExpression = [7, 29];
  private static readonly popupAnchor : PointExpression = [0, -18];

  // static readonly  setMarkerStyle = (color: string, border: string, radius: string, offset: Offset) => `
  //   background-color: ${color};
  //   width: ${Custom.defaultSize};
  //   height: ${Custom.defaultSize};
  //   display: block;
  //   left: ${offset.left};
  //   top: ${offset.top};
  //   position: relative;
  //   border-radius: ${radius};
  //   transform: rotate(45deg);
  //   border: ${border}
  // `;

  public static readonly userMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "user-marker-pin",
    iconAnchor: Custom.iconAnchor,
    // iconSize: [24, 24],
    popupAnchor: Custom.popupAnchor,
    //html: `<span style="${Custom.setMarkerStyle(Custom.userColor,Custom.userMarkerBorderValue, Custom.defaultBorderRadius, Custom.defaultMarkerOffset)}" />`
    html: `<span class="marker user-added-marker" />`
  });

  public static readonly serverMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "server-marker-pin",
    iconAnchor: Custom.iconAnchor,
    // iconSize: [24, 24],
    popupAnchor: Custom.popupAnchor,
    //html: `<span style="${Custom.setMarkerStyle(Custom.serverColor, Custom.serverMarkerBorderValue, Custom.defaultBorderRadius, Custom.defaultMarkerOffset)}" />`
    html: `<span class="marker server-marker" />`
  });

  public static readonly fetchedMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "fetched-marker-pin",
    iconAnchor: Custom.iconAnchor,
    // iconSize: [42, 42],
    popupAnchor: Custom.popupAnchor,
    //html: `<span style="${Custom.setMarkerStyle(Custom.fetchedColor, Custom.fetchedMarkerBorderValue, Custom.defaultBorderRadius, Custom.fetchedMarkerOffset)}" />`
    html: `<span class="marker fetched-marker" />`
  });

  public static readonly positionMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "position-marker-pin",
    iconAnchor: Custom.positionMarkerAnchor,
    // iconSize: [42, 42],
    popupAnchor: Custom.popupAnchor,
    //html: `<span style="${Custom.setMarkerStyle(Custom.positionColor, Custom.positionMarkerBorderValue, Custom.userPositionBorderRadius, Custom.defaultMarkerOffset)}" />`
    html: `<span class="marker position-marker" />`
  });

  public static readonly userMarker =
    (latLng: LatLngExpression) : Leaflet.Marker  =>
      Leaflet.marker(latLng, {icon: Custom.userMarkerIcon});

  public static readonly  serverMarker =
    (latLng: LatLngExpression) : Leaflet.Marker  =>
      Leaflet.marker(latLng, {icon: Custom.serverMarkerIcon});

  public static readonly  fetchedMarker =
    (latLng: LatLngExpression) : Leaflet.Marker  =>
      Leaflet.marker(latLng, {icon: Custom.fetchedMarkerIcon});

  public static readonly  positonMarker =
    (latLng: LatLngExpression) : Leaflet.Marker  =>
      Leaflet.marker(latLng, {icon: Custom.positionMarkerIcon});

  constructor(){}
}

export class MediaType{
  constructor(private maxWidthPx: number, private maxHeightPx: number){
  }

  getMaxWidthMediaQuery(): string{
    return "(max-width:"+ this.maxWidthPx +"px)";
  }

  getMaxHeightMediaQuery(): string{
    return "(max-height:"+ this.maxHeightPx +"px)";

  }
}

export class MediaTypes {
  static smartphone: MediaType = new MediaType(480, 736);
  static tablet: MediaType = new MediaType(768, 1024);
  static bigTablet: MediaType = new MediaType(1024, 1366)
}
