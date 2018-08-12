/**
 *  In this file are defined the data structures of Objects returned by RestApi call in order to use the http client
 *  automatic binding of json proprieties
 */
export interface Marker {
  MID: number;
  nDetections: number;
  coordinates: GeoCoordinates ;
  addressNode: OSMAddressNode;
}

export interface GeoCoordinates{
  lat: number;
  lng: number;
  radius: number;
}

export interface OSMAddressNode{
  houseNumber: number;
  road: string;
  neighbourhood: string;
  town: string;
  county: string;
  region: string;
  postcode: string;
  country: string;
  countryCode: string;
  place: string;
}
