import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {
  Coordinates,
  CURequest,
  GeoCoordinates,
  Marker,
  MarkerComment,
  MarkerUpVote,
  OSMAddressNode,
  Registration
} from "../../ontologies/DataStructures";
import {Observable, throwError} from "rxjs";
import {map} from 'rxjs/operators';
import {RouteAPIResponse} from "../../ontologies/RouteData";

@Injectable({
  providedIn: 'root'
})
export class RestAdapterService {

  rootApiUrl: string = "https://192.168.43.207:9443/api/pothole/";

  constructor(private httpClient: HttpClient) { }

  getMarkerAt(coordinates: GeoCoordinates){
    let requestUrl: string = this.rootApiUrl + "at?coordinates="+ coordinates.lng + " E," +
      coordinates.lat +" N";

    return this.httpClient.get<RESTServiceBodyResponse<Marker>>(requestUrl, httpOptions)
      .pipe(map(response => response.content));
  }

  getAllMarkers(country?: string, region?: string, county?: string, town?: string, road?: string){
    var apiUrl = this.rootApiUrl;
    if(country != undefined && country != "") {
      apiUrl = apiUrl + country + "/";
      if(region != undefined && region != ""){
        apiUrl = apiUrl + region + "/";
        if(county != undefined && county != ""){
          apiUrl = apiUrl + county + "/";
          if(town != undefined && town != ""){
            apiUrl = apiUrl + town + "/";
            if(road != undefined && road != ""){
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
    let reverseGeoCodingServiceUrl: string = this.rootApiUrl + "reverse?coordinates=" + lng + "E, " + lat + "N"
    return this.httpClient.get<RESTServiceBodyResponse<OSMAddressNode>>(reverseGeoCodingServiceUrl, httpOptions)
      .pipe(map(response => response.content));
  }

  getPlaceCoordinates(place: string): Observable<GeoCoordinates> {
    let geoCodingServiceUrl: string = this.rootApiUrl + "geodecode?place=" + place;

    return this.httpClient.get<RESTServiceBodyResponse<GeoCoordinates>>(geoCodingServiceUrl, httpOptions)
      .pipe(map(response => response.content));
  }

  getMarkerOnRouteByCoordinates(origin: GeoCoordinates, destination: GeoCoordinates, maxMetersFromPath: number){
    let requestUrl: string = this.rootApiUrl + "route?from="  + origin.lng + "E, " +  origin.lat
      + "N&to=" + destination.lng + "E, " + destination.lat
      + "N&dist=" + maxMetersFromPath;

    return this.doGETResourcesRequest(requestUrl);
  }

  getMarkerOnRouteByPlace(origin: string, destination: string, maxMetersFromPath: number){
    let requestUrl: string = this.rootApiUrl + "route?" +
      "from=" + origin +
      "&to=" + destination +
      "&dist=" + maxMetersFromPath;

    return this.httpClient.get<RESTServiceBodyResponse<RouteAPIResponse>>(requestUrl, httpOptions)
  }

  getAllMarkersInTheArea(origin: GeoCoordinates, radius: number){
    let requestUrl: string = this.rootApiUrl + "area?origin="+ origin.lng + "E, " + origin.lat
      + "N&radius=" + radius;

    return this.doGETResourcesRequest(requestUrl);
  }

  addMarker(request: CURequest<Coordinates>, onSuccess: (value: any) => void, onError: (error: any) => void){
    // let marker: CURequest<Coordinates> = new Coordinates(coordinates.lat, coordinates.lng);
    console.log(request);
    return this.httpClient.post<CURequest<Coordinates>>(this.rootApiUrl, request, httpOptions).subscribe(onSuccess, onError);
  }

  addComment(request: CURequest<MarkerComment>, onSuccess: (value: any) => void, onError: (error: any) => void){
    let url: string = this.rootApiUrl + request.content.markerId  + "/comment";
    this.httpClient.put<CURequest<MarkerComment>>(url, request, httpOptions).subscribe(onSuccess, onError);
  }

  addUpVote(request: CURequest<MarkerUpVote>, onSuccess: (value: any) => void, onError: (error: any) => void){
    let url: string = this.rootApiUrl + request.content.markerId + "/upvote";
    this.httpClient.put<CURequest<MarkerUpVote>>(url, request, httpOptions).subscribe(onSuccess, onError);
  }

  addRegistration(token: Registration, onSuccess: (value: any) => void, onError: (error: any) => void){
    let url: string = this.rootApiUrl + "register";
    return this.httpClient.post<Registration>(url, token, httpOptions).subscribe(onSuccess, onError);
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

