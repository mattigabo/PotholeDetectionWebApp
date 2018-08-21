import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {GeoCoordinates, Marker, MarkerComment, OSMAddressNode} from "./Ontologies";
import {Observable , throwError} from "rxjs/index";
import { map , catchError } from 'rxjs/operators'
import {tap} from "rxjs/internal/operators";

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

  getLocationInfo(lat: number, lng: number): Observable<OSMAddressNode>{
    var geoCodingServiceUrl: string = this.rootApiUrl + "reverse?coordinates=[" + lat + ", " + lng + "]"
    return this.httpClient.get<GeoServiceResponse>(geoCodingServiceUrl, httpOptions)
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

  addMarker(coordinates: GeoCoordinates, onSuccess: (value: MarkerForPost) => void, onError: (error: any) => void){
    var marker: MarkerForPost = new MarkerForPost(coordinates.lat, coordinates.lng);
    return this.httpClient.post<MarkerForPost>(this.rootApiUrl, marker, httpOptions).subscribe(onSuccess, onError);
  }

  addComment(comment: MarkerComment){
    var url: string = this.rootApiUrl + comment.marker
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
