import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import * as Leaflet from 'leaflet';
import {RestAdapterService} from "../rest-adapter.service";
import {LAYER_NAME, MapsWrapper} from "../maps/maps.wrapper";
import {CoordinatesComponent} from "../maps/coordinates/coordinates.component";
import {DistributionService, Entry} from "../maps/distribution.service";
import {CoordinatesService} from "../maps/coordinates/coordinates.service";
import {MapAddict} from "../map-addict";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent extends MapAddict {

  help = "";
  about =
    'Alma Mater Studiorum Bologna - Laurea Magistrale in Ingegneria e Scienze Informatiche\n' +
    '\nProgetto di Applicazioni e Servizi Web\n' +
    '\nAlessandro Cevoli, Matteo Gabellini';
  credits = 'pumpkinheads@gmail.com';
  repository = 'https://github.com/mattigabo/PotholeDetectionWebApp';

  constructor(private restService : RestAdapterService,
              private distributionService: DistributionService) {

    super();

    distributionService.subscribe(entry => {
      if (entry.key === MapsWrapper.name &&
          entry.value instanceof MapsWrapper) {

        super.init(entry.value);

        $('#filter-by-place-send-button').on('click', function () {
          // ToDo
        });

        $('#filter-by-route-send-button').on('click', function () {
          // ToDo
        });

        console.log("Header Component Ready!");
      }
    });

  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  openFiltersNav = (clickEvent : Event) => {

    this.distributionService.submit(new Entry(CoordinatesService.ACTIONS.HIDE_ALL, true));

    $('#filters-button').fadeOut(100, function () {
      $('#filters-nav').animate({
        width:"toggle",
        display:"flex"
      }, 500);
    });

    $('.filters-nav-form').each(function (idx, obj) {
      $(obj).show(600);
      $(obj).css({
        disply: "flex"
      });
    });
  };

  closeFiltersNav = (clickEvent : Event) => {

    this.distributionService.submit(new Entry(CoordinatesService.ACTIONS.HIDE_ALL, true));

    $('.filters-nav-form').each(function (idx, obj) {
      $(obj).hide();
    });

    $('#filters-nav').animate({
      width:"toggle",
      display: "none"
    }, 500, function () {
      $('#filters-button').fadeIn(100);
    });
  };

}
