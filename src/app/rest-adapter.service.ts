import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {Marker} from "./Ontologies";
import {Observable} from "rxjs/index";
import { map } from 'rxjs/operators'

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
    return this.makeRequest(this.rootApiUrl);
  }

  getAllMarkersByRoadName(road:string){
    let roadApiUrl = this.rootApiUrl + "/road/" + road;
    this.makeRequest(roadApiUrl);
  }

  private makeRequest(apiUrl: string){
    let oPothole: Observable<Marker[]> = this.httpClient.get<AllMarkersApiResponse>(apiUrl, httpOptions)
      .pipe(map(response => response.content));
    return oPothole;
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
