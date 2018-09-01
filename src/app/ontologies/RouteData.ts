/**
 *  In this file are defined the data structures that rappresents the route data returned by the RestAPI
 *  used to calculate the route from a point A to point B
 */
import {Marker} from "./DataStructures";
import {LatLngExpression} from "leaflet";

export interface RouteAPIResponse{
  markers: Marker[];
  routeServiceResponse: RouteServiceResponse;
}

export interface RouteServiceResponse{
  routes: Route[];
  bbox: number[];
  info: Info;
}

export interface Route{
  summary: RouteSummary
  geometry_format: string;
  geometry: Geometry;
  segments: Segment[];
  way_points: number[];
  bbox: number[];
}

export interface RouteSummary{
  distance: number;
  duration: number;
}

export interface Geometry{
  type: string;
  coordinates: LngLat[];
}

export interface LngLat{
  lng: number;
  lat: number;
}

export interface Segment{
  distance: number;
  duration: number;
  steps: Step[];
}


export interface Step{
  distance: number;
  duration: number;
  type: number;
  instruction: string;
  name: string;
  way_points: number[];
}



export interface Info{
  attribution: string;
  osm_file_md5_hash: string;
  engine: Engine;
  service: string;
  timestamp: Date;
  query: Query;
}

export interface Engine{
  versione: string;
  build_date: string;
}

export interface Query{
  profile: string;
  preference: string;
  coordinates: LngLat[];
  language: string;
  units: string;
  geometry:boolean;
  geometry_format:string;
  geometry_simplify:boolean;
  instructions_format:string;
  instructions: boolean;
  elevation: boolean;
}
