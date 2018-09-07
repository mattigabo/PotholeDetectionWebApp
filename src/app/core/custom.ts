import * as Leaflet from "leaflet";
import {LatLngExpression} from "leaflet";

export class Custom {

  public static readonly userColor : string = '#00ccff';
  public static readonly serverColor: string = '#76197b';
  public static readonly fetchedColor: string = '#ffdc23';

  static readonly  setMarkerColor = (color: string) => `
    background-color: ${color};
    width: 2rem;
    height: 2rem;
    display: block;
    left: -1.0rem;
    top: -1.0rem;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 2px solid #333333
  `;

  public static readonly userMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "user-marker-pin",
    iconAnchor: [0, 24],
    // iconSize: [24, 24],
    popupAnchor: [0, -36],
    html: `<span style="${Custom.setMarkerColor(Custom.userColor)}" />`
  });

  public static readonly serverMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "user-marker-pin",
    iconAnchor: [0, 24],
    // iconSize: [24, 24],
    popupAnchor: [0, -36],
    html: `<span style="${Custom.setMarkerColor(Custom.serverColor)}" />`
  });

  public static readonly fetchedMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "user-marker-pin",
    iconAnchor: [0, 24],
    iconSize: [42, 42],
    popupAnchor: [0, -36],
    html: `<span style="${Custom.setMarkerColor(Custom.fetchedColor)}" />`
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
