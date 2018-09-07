import {Component} from '@angular/core';
import * as $ from 'jquery';
import * as Leaflet from 'leaflet';
import {RestAdapterService} from "../services/rest/rest-adapter.service";
import {MapsWrapper} from "../core/maps.wrapper";
import {DistributionService, Entry} from "../services/distribution/distribution.service";
import {CoordinatesService} from "../services/coordinates/coordinates.service";
import {MapAddict} from "../core/map-addict";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent extends MapAddict {

  help = "https://github.com/mattigabo/PotholeDetectionWebApp/wiki/Web-App-Functionalities";
  email = 'pumpkinheads@gmail.com';
  mail_sender = "https://mail.google.com/mail/u/0/?view=cm&fs=1&to=" + this.email + "&tf=1";
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
