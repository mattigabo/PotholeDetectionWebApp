import * as Leaflet from "leaflet";
import {LatLngExpression, PointExpression} from "leaflet";

interface Offset{
  left:string;
  top:string;
}
export class Custom {

  public static readonly userColor : string = '#00ccff';
  public static readonly serverColor: string = '#339933';

  public static readonly fetchedBorderColor: string = '#ff4e00';
  public static readonly defaultBorderColor: string = '#222222';

  private static readonly fetchedMarkerBorderValue: string = '4px solid ' + Custom.fetchedBorderColor;
  private static readonly userMarkerBorderValue: string = '2px solid ' + Custom.defaultBorderColor;
  private static readonly serverMarkerBorderValue: string = '2px solid ' + Custom.defaultBorderColor;
  private static readonly fetchedMarkerOffset: Offset = { left: '-1.15em', top: '-1.15em' };
  private static readonly defaultMarkerOffset: Offset = { left: '-1.0em', top: '-1.0em' };
  private static readonly iconAnchor : PointExpression = [0, 12];
  private static readonly popupAnchor : PointExpression = [0, -18];
  private static readonly defaultSize : string = '1rem';

  static readonly  setMarkerColor = (color: string, border: string, offset: Offset) => `
    background-color: ${color};
    width: ${Custom.defaultSize};
    height: ${Custom.defaultSize};
    display: block;
    left: ${offset.left};
    top: ${offset.top};
    position: relative;
    border-radius: ${Custom.defaultSize} ${Custom.defaultSize} 0;
    transform: rotate(45deg);
    border: ${border}
  `;

  public static readonly userMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "user-marker-pin",
    iconAnchor: Custom.iconAnchor,
    // iconSize: [24, 24],
    popupAnchor: Custom.popupAnchor,
    html: `<span style="${Custom.setMarkerColor(Custom.userColor,Custom.userMarkerBorderValue, Custom.defaultMarkerOffset)}" />`
  });

  public static readonly serverMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "user-marker-pin",
    iconAnchor: Custom.iconAnchor,
    // iconSize: [24, 24],
    popupAnchor: Custom.popupAnchor,
    html: `<span style="${Custom.setMarkerColor(Custom.serverColor, Custom.serverMarkerBorderValue, Custom.defaultMarkerOffset)}" />`
  });

  public static readonly fetchedMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "user-marker-pin",
    iconAnchor: Custom.iconAnchor,
    // iconSize: [42, 42],
    popupAnchor: Custom.popupAnchor,
    html: `<span style="${Custom.setMarkerColor('transparent', Custom.fetchedMarkerBorderValue, Custom.fetchedMarkerOffset)}" />`
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

  constructor(){}
}

