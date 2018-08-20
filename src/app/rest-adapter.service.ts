import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {GeoCoordinates, Marker, MarkerComment, OSMAddressNode} from "./Ontologies";
import {Observable , throwError} from "rxjs/index";
import { map , catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RestAdapterService {

  rootApiUrl: string = "http://localhost:8080/api/pothole/";

  constructor(private httpClient: HttpClient) { }

  getAllMarkers(country?: string, region?: string, county?: string, town?: string, road?: string){
    var apiUrl = this.rootApiUrl;
    if(country != undefined) {
      apiUrl = apiUrl + country + "/"
      if(region != undefined){
        apiUrl = apiUrl + region + "/"
        if(county != undefined){
          apiUrl = apiUrl + county + "/"
          if(town != undefined){
            apiUrl = apiUrl + town + "/"
            if(road != undefined){
              apiUrl = apiUrl + road + "/"
            }
          }
        }
      }
    }
    return this.doGETResourcesRequest(this.rootApiUrl);
  }

  getAllMarkersByRoadName(road:string){
    let roadApiUrl = this.rootApiUrl + "/road/" + road;
    this.doGETResourcesRequest(roadApiUrl);
  }

  private doGETResourcesRequest(apiUrl: string){
    let oPothole: Observable<Marker[]> = this.httpClient.get<AllMarkersApiResponse>(apiUrl, httpOptions)
      .pipe(map(response => response.content));
    return oPothole;
  }

  getLocationInfo(lat: number, lng: number){
    var geoCodingServiceUrl: string = this.rootApiUrl + "reverse?coordinater=[" + lat + ", " + lng + "]"
    this.httpClient.get<GeoServiceResponse>(geoCodingServiceUrl, httpOptions)
      .pipe(map(response => response.content));;
  }

  getMarkerInThePath(pointA: GeoCoordinates, pointB: GeoCoordinates, maxMetersFromPath: number){
    var requestUrl: string = this.rootApiUrl + "route?from=["  + pointA.lat + ", " +  pointA.lng
      + "]&to=[" + pointB.lat + ", " + pointB.lng
      + "]&dist=" + maxMetersFromPath;

    return this.doGETResourcesRequest(requestUrl);
  }

  getAllMarkersInTheArea(topLeftCorner: GeoCoordinates, bottomRightCorner: GeoCoordinates){
    var requestUrl: string = this.rootApiUrl + "area?tlc=["+ topLeftCorner.lat + ", " + topLeftCorner.lng
      + "]&brc=[" + bottomRightCorner.lat + "," + bottomRightCorner.lng + "]"

    return this.doGETResourcesRequest(requestUrl);
  }

  addMarker(coordinates: GeoCoordinates){
    var marker: MarkerForPost = new MarkerForPost(coordinates.lat, coordinates.lng);
    return this.httpClient.post<MarkerForPost>(this.rootApiUrl, marker, httpOptions)
  }

  addComment(comment: MarkerComment){
    var url: string = this.rootApiUrl + comment.marker
    this.httpClient.put<MarkerComment>(url, comment, httpOptions);
  }



}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
}

interface AllMarkersApiResponse {
  id: number;
  content: Marker[];
  info: string;
}

interface GeoServiceResponse{
  id: number;
  content: OSMAddressNode;
  info: string;
}

class MarkerForPost{
  lat: number;
  lng: number;

  constructor(lat:number, lng: number){
    this.lat = lat;
    this.lng = lng
  }
}
