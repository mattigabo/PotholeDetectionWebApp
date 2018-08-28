/**
 *  In this file are defined the data structures of Objects returned by RestApi call in order to use the http client
 *  automatic binding of json proprieties
 */
export interface Marker {
  id: number;
  nDetections: number;
  coordinates: GeoCoordinates ;
  addressNode: OSMAddressNode;
}

export class GeoCoordinates{
  lat: number;
  lng: number;
  radius: number;

  constructor(lat:number, lng:number, radius?: number){
    this.lat  = lat;
    this.lng = lng;
    if(radius != undefined){
      this.radius = radius;
    } else {
      this.radius = 0;
    }
  }
}

export interface OSMAddressNode{
  houseNumber: string;
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

export interface MarkerComment {
  marker: number,
  comment: string,
  date: number;
}
