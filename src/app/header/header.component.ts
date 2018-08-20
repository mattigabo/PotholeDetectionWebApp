import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import L from 'leaflet';
import {RestAdapterService} from "../rest-adapter.service";
import {MapSingleton} from "../map-singleton";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, AfterViewInit {

  help = "";
  about =
    'Alma Mater Studiorum Bologna - Laurea Magistrale in Ingegneria e Scienze Informatiche\n' +
    '\nProgetto di Applicazioni e Servizi Web\n' +
    '\nAlessandro Cevoli, Matteo Gabellini';
  credits = 'pumpkinheads@gmail.com';
  repository = 'https://github.com/mattigabo/PotholeDetectionWebApp';

  constructor(private restService : RestAdapterService) { }

  ngOnInit() {
    $(document).ready(() => {
      $('#filters-button').on('click', function () {
        $('.overlay').each(function (idx, obj) {
          $(obj).hide()
        });
        $('#filters-button').fadeOut(100, function () {
          $('#filters-nav').animate({
            width:"toggle",
            display:"flex"
          }, 500);
        });

        $('.filters-nav-form').each(function (idx, obj) {
          $(obj).show(600);
        });
      });

      $('#filters-nav-close-button').on('click', function () {
        $('.overlay').each(function (idx, obj) {
          $(obj).hide()
        });

        $('.filters-nav-form').each(function (idx, obj) {
          $(obj).hide();
        });

        $('#filters-nav').animate({
          width:"toggle",
          display: "none"
        }, 500, function () {
          $('#filters-button').fadeIn(100);
        });
      });


    });
  }

  ngAfterViewInit(): void {
    $(document).ready(() => {
      let osmMap : L.Map = MapSingleton.instance().map();
      let layers : L.LayerGroup = MapSingleton.instance().layers();
      let index : number[] = MapSingleton.instance().index();

      console.log(index);
      console.log(osmMap);
      console.log(layers);

      $('#filter-by-place-send-button').on('click', function () {
        // ToDo
      });

      $('#filter-by-route-send-button').on('click', function () {
        // ToDo
      });
    });
  }

}
