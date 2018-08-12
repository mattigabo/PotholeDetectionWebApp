import { Component, OnInit } from '@angular/core';
import L from 'leaflet';
import {RestAdapterService} from "../rest-adapter.service";
import {Marker} from "../Ontologies";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})

export class MapsComponent implements OnInit {

  constructor(private restService: RestAdapterService) { }

  ngOnInit() {
    let body = {town:"Riccione"};

    console.log(body);

    var osmMap = L.map('osmMap').setView([51.505, -0.09], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> ' +
      'contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoicHVtcGtpbnNoZWFkIiwiYSI6ImNqa2NuM3l2cDFzdGYzcXA4MmoyZ2dsYWsifQ.FahVhmZj5RODSwGjl5-EaQ'
    }).addTo(osmMap);


    this.restService.getAllMarker().subscribe( (potholes: Marker[]) =>  {
      potholes.forEach((m: Marker) => {
        console.log(m);
        var poi = L.marker(m.coordinates).addTo(osmMap);
        console.log(poi);
      })
      }
    );
  }

}
