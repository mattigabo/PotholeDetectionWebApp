import {Component} from '@angular/core';
import * as $ from 'jquery';
import * as Leaflet from 'leaflet';
import {RestAdapterService} from "../services/rest/rest-adapter.service";
import {MapsWrapper} from "../maps/maps.wrapper";
import {DistributionService, Entry} from "../services/distribution/distribution.service";
import {CoordinatesService} from "../services/coordinates/coordinates.service";
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

    $('#filters-button').fadeOut(100, () => {
      $('#filters-nav').animate({
        width:'toggle'
      }, 500, () => {

        $('#filters-nav').css({display:'flex'});

        $('#filters-nav--header').css({display: 'flex'});

        $('#filters-nav--entries').css({display: 'flex'});
      });
    });
  };
}
