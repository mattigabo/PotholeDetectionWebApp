import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {Toast, ToasterConfig, ToasterService} from "angular2-toaster";
import {WindowService} from "./services/window/window.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public potholeSystemToastConfig : ToasterConfig = new ToasterConfig({
    positionClass: 'toast-bottom-left',
    timeout:3000,
    animation: 'fade',
    showCloseButton: true
  });

  constructor(private toaster: ToasterService,
              private windower: WindowService) {
  }

  ngOnInit(): void {

    if(/Android/.test(navigator.appVersion)) {
      window.addEventListener("resize", function() {
        if(document.activeElement.tagName=="INPUT"
          || document.activeElement.tagName=="TEXTAREA") {
          document.activeElement.scrollIntoView(true);
        }
      })
    }

    this.windower.setWindowMaxDimensions($(window).height(), $(window).width());
    // this.windower.setWindowMaxDimensions(screen.height, screen.width);

    $(document).on('keyup', (keyEvent) => {

        let key = keyEvent.key ? keyEvent.key.toUpperCase() : keyEvent.which;

        if (key === "ESCAPE") {
          $('.close-on-esc').each(function (idx, obj) {
            console.log(obj);
            $(obj).hide();
          });

          $('.open-on-esc').each(function (idx, obj) {
            $(obj).show();
          });
        }
      });
  }
}
