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

export class GeoCoordinates {
  lng: number;
  lat: number;
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

export interface OSMAddressNode {

  country:string;
  countryCode:string;
  region:string; // like "Emilia-Romagna"
  county:string; // like "RN"
  city:string;
  district:string;
  suburb:string;
  town:string;
  village:string;
  neighbourhood:string;
  place:string; // address29
  postcode:string;
  road:string;
  houseNumber:string;
}

export class MarkerComment {
  markerId: number;
  text: string;
  date: number;

  constructor(markerId:number, text: string, date?: number){
    this.markerId = markerId;
    this.text = text;
    if(date != undefined){
      this.date = date;
    } else {
      this.date = Date.now();
    }
  }
}
