import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {GeoCoordinates, Marker, MarkerComment, OSMAddressNode} from "./ontologies";
import {Observable , throwError} from "rxjs/index";
import { map , catchError } from 'rxjs/operators'
import {tap} from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root'
})
export class RestAdapterService {

  rootApiUrl: string = "http://localhost:8080/api/pothole/";

  constructor(private httpClient: HttpClient) { }

  getMarkerAt(coordinates: GeoCoordinates){
    let requestUrl: string = this.rootApiUrl + "at?coordinates=["+ coordinates.lat + ", " +
      coordinates.lng +"]";

    return this.httpClient.get<RESTServiceBodyResponse<Marker>>(requestUrl, httpOptions)
      .pipe(map(response => response.content));
  }

  getAllMarkers(country?: string, region?: string, county?: string, town?: string, road?: string){
    var apiUrl = this.rootApiUrl;
    if(country != undefined || country != "") {
      apiUrl = apiUrl + country + "/";
      if(region != undefined || region != ""){
        apiUrl = apiUrl + region + "/";
        if(county != undefined || county != ""){
          apiUrl = apiUrl + county + "/";
          if(town != undefined || town != ""){
            apiUrl = apiUrl + town + "/";
            if(road != undefined || road != ""){
              apiUrl = apiUrl + road + "/";
            }
          }
        }
      }
    }
    console.log(apiUrl);
    return this.doGETResourcesRequest(apiUrl);
  }

  getAllMarkersByRoadName(road:string){
    let roadApiUrl = this.rootApiUrl + "/road/" + road;
    this.doGETResourcesRequest(roadApiUrl);
  }

  private doGETResourcesRequest = (apiUrl: string) : Observable<Marker[]> =>
    this.httpClient.get<RESTServiceBodyResponse<Marker[]>>(apiUrl, httpOptions)
      .pipe(map(response => response.content));

  getLocationInfo(lat: number, lng: number): Observable<OSMAddressNode>{
    let reverseGeoCodingServiceUrl: string = this.rootApiUrl + "reverse?coordinates=[" + lat + ", " + lng + "]"
    return this.httpClient.get<RESTServiceBodyResponse<OSMAddressNode>>(reverseGeoCodingServiceUrl, httpOptions)
      .pipe(map(response => response.content));
  }

  getPlaceCoordinates(place: string): Observable<GeoCoordinates> {
    let geoCodingServiceUrl: string = this.rootApiUrl + "geodecode?place=" + place;

    return this.httpClient.get<RESTServiceBodyResponse<GeoCoordinates>>(geoCodingServiceUrl, httpOptions)
      .pipe(map(response => response.content));
  }

  getMarkerInThePath(pointA: GeoCoordinates, pointB: GeoCoordinates, maxMetersFromPath: number){
    let requestUrl: string = this.rootApiUrl + "route?from=["  + pointA.lat + ", " +  pointA.lng
      + "]&to=[" + pointB.lat + ", " + pointB.lng
      + "]&dist=" + maxMetersFromPath;

    return this.doGETResourcesRequest(requestUrl);
  }

  getAllMarkersInTheArea(origin: GeoCoordinates, radius: number){
    let requestUrl: string = this.rootApiUrl + "area?origin=["+ origin.lat + ", " + origin.lng
      + "]&radius=" + radius;

    return this.doGETResourcesRequest(requestUrl);
  }

  addMarker(coordinates: GeoCoordinates, onSuccess: (value: MarkerForPost) => void, onError: (error: any) => void){
    let marker: MarkerForPost = new MarkerForPost(coordinates.lat, coordinates.lng);
    return this.httpClient.post<MarkerForPost>(this.rootApiUrl, marker, httpOptions).subscribe(onSuccess, onError);
  }

  addComment(comment: MarkerComment){
    let url: string = this.rootApiUrl + comment.marker;
    this.httpClient.put<MarkerComment>(url, comment, httpOptions);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  };

}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};


interface RESTServiceBodyResponse<T>{
  id: number;
  content: T;
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
