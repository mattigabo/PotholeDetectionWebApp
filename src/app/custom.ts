import * as Leaflet from "leaflet";
import {LatLng, LatLngExpression, LatLngLiteral} from "leaflet";
import {LatLngTuple} from "leaflet";

export class Custom {

  public static readonly  userColor : string = '#00ccff';
  public static readonly fetchedColor: string = '#00ffaa';

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
    border: 2px solid #111111
  `;

  public static readonly userMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "user-marker-pin",
    iconAnchor: [0, 24],
    // iconSize: [24, 24],
    popupAnchor: [0, -36],
    html: `<span style="${Custom.setMarkerColor(Custom.userColor)}" />`
  });

  public static readonly fetchedMarkerIcon : Leaflet.DivIcon = Leaflet.divIcon({
    className: "user-marker-pin",
    iconAnchor: [0, 24],
    // iconSize: [24, 24],
    popupAnchor: [0, -36],
    html: `<span style="${Custom.setMarkerColor(Custom.fetchedColor)}" />`
  });

  public static readonly userMarker =
    (latLng: LatLngExpression) : Leaflet.Marker  =>
      Leaflet.marker(latLng, {icon: Custom.userMarkerIcon});

  public static readonly  serverMarker =
    (latLng: LatLngExpression) : Leaflet.Marker  =>
      Leaflet.marker(latLng, {icon: Custom.fetchedMarkerIcon});

  constructor(){}
}
