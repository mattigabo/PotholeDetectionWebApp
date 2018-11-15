/**
 *  In this file are defined the setData structures of Objects returned by RestApi call in order to use the http client
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

  toCoordinates(){
    return new Coordinates(this.lat, this.lng);
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
  posting_date: number;

  constructor(markerId:number, text: string, date?: number){
    this.markerId = markerId;
    this.text = text;
    if(date != undefined){
      this.posting_date = date;
    } else {
      this.posting_date = Date.now();
    }
  }
}

export class Registration{
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}


export class MarkerUpVote{
  markerId: number;

  constructor(markerId:number) {
    this.markerId = markerId;
  }
}

export class CURequest<T> {

  token: string;
  content: T;

  constructor(token: string, content: T) {
    this.token = token;
    this.content = content;
  }
}

export class Coordinates {
  lat: number;
  lng: number;

  constructor(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng
  }
}
