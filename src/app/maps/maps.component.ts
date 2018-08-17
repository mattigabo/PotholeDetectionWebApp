import { Component, OnInit } from '@angular/core';
import L from 'leaflet';
import {FeaturesService} from './leaflet.extensions';
import {RestAdapterService} from "../rest-adapter.service";
import {Marker} from "../Ontologies";
import * as $ from "jquery";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})

export class MapsComponent implements OnInit {

  private osmMap;
  private fetchedMarkers;

  constructor(private restService: RestAdapterService) {
    L.Control.zoomControl = false;
  }

  ngOnInit() {

    this.osmMap = L.map('osm-map', {
      zoomControl: false
    }).setView([44, 12], 10);

    let tile_layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | ' +
        '&copy; <a href="https://www.mapbox.com/">Mapbox</a> | ' +
        '<a href="https://www.linkedin.com/in/alessandro-cevoli/">Xander</a>&' +
                  '<a href="https://www.linkedin.com/in/matteogabellini/">Gabe</a>',
      maxZoom: 20,
      minZoom: 5,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoicHVtcGtpbnNoZWFkIiwiYSI6ImNqa2NuM3l2cDFzdGYzcXA4MmoyZ2dsYWsifQ.FahVhmZj5RODSwGjl5-EaQ'
    });

    tile_layer.addTo(this.osmMap);

    this.fetchedMarkers = L.featureGroup();

    this.fetchedMarkers.on('click', function (clickEvent) {

      let
        lat = clickEvent.latlng.lat.toFixed(4).toString(),
        lng = clickEvent.latlng.lng.toFixed(4).toString()
      ;

      if (clickEvent.latlng) {

        $('#marker-popup-val').html(lat + '<strong> N </strong>, ' + lng + '<strong> E </strong> ');
        $('#marker-popup').css({
          display: 'flex',
          left: (clickEvent.containerPoint.x - 140).toString() + "px",
          top: (clickEvent.containerPoint.y - 200).toString() + "px"
        });
      }
    });

    this.fetchedMarkers.addTo(this.osmMap);

    var cs = new FeaturesService(this.osmMap);

    this.restService.getAllMarkers()
      .subscribe( (potholes: Marker[]) =>  {
        potholes.forEach((m: Marker) => {
          this.addMarkerToTheMap(m);
        })
      }
    );
  }

  private addMarkerToTheMap(m: Marker){
    console.log(m);
    let poi = L.marker(m.coordinates)
      .addTo(this.fetchedMarkers)
      .bindPopup($('#marker-popup').html());
    console.log(poi);
  }
}
