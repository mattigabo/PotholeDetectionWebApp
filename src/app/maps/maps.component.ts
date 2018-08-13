import { Component, OnInit } from '@angular/core';
import L from 'leaflet';
import {RestAdapterService} from "../rest-adapter.service";
import {Marker} from "../Ontologies";
import {CoordinatesService} from './leaflet.extensions';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})

export class MapsComponent implements OnInit {

  private osmMap;

  constructor(private restService: RestAdapterService) {
    // L.Control.Coordinates = L.Control.extend(CoordinatesService());
    L.Control.zoomControl = false;
  }

  ngOnInit() {
    this.osmMap = L.map('osmMap', {zoomControl:false}).setView([44, 12], 10);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution:
        'Map &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | ' +
        'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a> | ' +
        'Contribs <a href="https://www.linkedin.com/in/alessandro-cevoli/">Xander</a>&' +
                  '<a href="https://www.linkedin.com/in/matteogabellini/">Gabe </a>',
      maxZoom: 20,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoicHVtcGtpbnNoZWFkIiwiYSI6ImNqa2NuM3l2cDFzdGYzcXA4MmoyZ2dsYWsifQ.FahVhmZj5RODSwGjl5-EaQ'
    }).addTo(this.osmMap);

    var cs = new CoordinatesService(this.osmMap);



    this.restService.getAllMarkers().subscribe( (potholes: Marker[]) =>  {
      potholes.forEach((m: Marker) => {
        this.addMarkerToTheMap(m);
      })
      }
    );
  }


  private addMarkerToTheMap(m: Marker){
    console.log(m);
    var poi = L.marker(m.coordinates)
      .addTo(this.osmMap)
      .bindPopup(document.getElementById('leaflet-popup-html').innerHTML);;
    console.log(poi);
  }
}
