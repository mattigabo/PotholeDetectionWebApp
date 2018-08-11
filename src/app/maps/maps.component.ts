import { Component, OnInit } from '@angular/core';
import L from 'leaflet';
import {CoordinatesService} from './leaflet.extensions';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})

export class MapsComponent implements OnInit {

  constructor() {
    // L.Control.Coordinates = L.Control.extend(CoordinatesService());
    L.Control.zoomControl = false;
  }

  ngOnInit() {

    var osmMap = L.map('osmMap', {zoomControl:false}).setView([44, 12], 10);

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
    }).addTo(osmMap);

    var cs = new CoordinatesService(osmMap);

  }

}
