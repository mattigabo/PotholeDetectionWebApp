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

  allMarkersApiUrl: string = "http://localhost:8080/api/pothole/";

  constructor(private httpClient: HttpClient) { }

  getAllMarker(){
    let oPothole: Observable<Marker[]> = this.httpClient.get<AllMarkersApiResponse>(this.allMarkersApiUrl, httpOptions).pipe(map(response => response.content));
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
