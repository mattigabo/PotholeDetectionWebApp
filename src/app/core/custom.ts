import * as Leaflet from "leaflet";
import {LatLngExpression} from "leaflet";

interface Offset{
  left:string;
  top:string;
}
export class Custom {

  public static readonly userColor : string = '#00ccff';
  public static readonly serverColor: string = '#76197b';

  public static readonly fetchedBorderColor: string = '#f2ff00';
  private static readonly fetchedMarkerBorderValue: string = '7px solid ' + Custom.fetchedBorderColor;
  private static readonly defaultMarkerBorderValue: string = '2px solid #333333';
  private static readonly fetchedMarkerOffset: Offset = { left: '-1.3em', top: '-1.3em' };
  private static readonly defaultMarkerOffset: Offset = { left: '-1.0em', top: '-1.0em' };


  static readonly  setMarkerColor = (color: string, border: string, offset: Offset) => `
    background-color: ${color};
    width: 2rem;
    height: 2rem;
    display: block;
    left: ${offset.left};
    top: ${offset.top};
    position: relative;
    border-radius: 2rem 2rem 0;
    transform: rotate(45deg);
    border: ${border}
  `;

  public static readonly userMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "user-marker-pin",
    iconAnchor: [0, 24],
    // iconSize: [24, 24],
    popupAnchor: [0, -36],
    html: `<span style="${Custom.setMarkerColor(Custom.userColor,Custom.defaultMarkerBorderValue, Custom.defaultMarkerOffset)}" />`
  });

  public static readonly serverMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "user-marker-pin",
    iconAnchor: [0, 24],
    // iconSize: [24, 24],
    popupAnchor: [0, -36],
    html: `<span style="${Custom.setMarkerColor(Custom.serverColor, Custom.defaultMarkerBorderValue, Custom.defaultMarkerOffset)}" />`
  });

  public static readonly fetchedMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "user-marker-pin",
    iconAnchor: [0, 24],
    iconSize: [42, 42],
    popupAnchor: [0, -36],
    html: `<span style="${Custom.setMarkerColor('', Custom.fetchedMarkerBorderValue, Custom.fetchedMarkerOffset)}" />`
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

