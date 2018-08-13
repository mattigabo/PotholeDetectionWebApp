import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  help = "";
  about =
    'Alma Mater Studiorum Bologna - Laurea Magistrale in Ingegneria e Scienze Informatiche\n' +
    '\nProgetto di Applicazioni e Servizi Web\n' +
    '\nAlessandro Cevoli, Matteo Gabellini';
  credits = 'pumpkinheads@gmail.com';
  repository = 'https://github.com/mattigabo/PotholeDetectionWebApp';

  constructor() { }

  ngOnInit() {

    $('#menu-button').on('click', function () {

      $('#menu-button').fadeOut(100, function () {
        $('#sideNav').animate({"width":"toggle"}, 500);
      });
    });

    $('#nav-close-button').on('click', function () {
      $('#sideNav').animate({"width":"toggle"}, 500, function () {
          $('#menu-button').fadeIn(100);
      });
    })

  }
}
