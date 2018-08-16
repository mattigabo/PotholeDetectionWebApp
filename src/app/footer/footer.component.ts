import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {

  title = 'PotholeDetectionWebApp';
  agency = 'Alma Mater Studiorum Bologna - Laurea Magistrale in Ingegneria e Scienze Informatiche';
  credits = 'PumpkinsHeads Team'

  constructor() { }

  ngOnInit() {
    $('#draw-nav-button').on('click', function () {

      $('.overlay').each(function (idx, obj) {
          $(obj).hide()
      });

      $('#draw-nav-button').fadeOut(100, function () {
        $('#draw-nav').animate({"width":"show"}, 500);
      });
    });

    $('#draw-nav-close-button').on('click', function () {

      $('.overlay').each(function (idx, obj) {
        $(obj).hide()
      });

      $('#draw-nav').animate({"width":"hide"}, 500, function () {
        $('#draw-nav-button').fadeIn(100);
      });
    })
  }

}
