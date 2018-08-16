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

    $('#filters-button').on('click', function () {
      $('.overlay').each(function (idx, obj) {
        $(obj).hide()
      });
      $('#filters-button').fadeOut(100, function () {
        $('#filters-nav').animate({"width":"toggle"}, 500);
      });
    });

    $('#filters-nav-close-button').on('click', function () {
      $('.overlay').each(function (idx, obj) {
        $(obj).hide()
      });
      $('#filters-nav').animate({"width":"toggle"}, 500, function () {
          $('#filters-button').fadeIn(100);
      });
    })

  }
}
