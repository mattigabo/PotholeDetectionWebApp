import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {Toast, ToasterConfig, ToasterService} from "angular2-toaster";
import {WindowService} from "./services/window/window.service";
// import a11yChecker from 'a11y-checker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {

  public potholeSystemToastConfig : ToasterConfig = new ToasterConfig({
    positionClass: 'toast-bottom-left',
    timeout:4000,
    animation: 'fade',
    showCloseButton: true
  });

  constructor(private toaster: ToasterService,
              private windower: WindowService) {
  }

  ngOnInit(): void {

    if(/Android/.test(navigator.appVersion)) {
      $(window).on("resize", () => {
        if(document.activeElement.tagName=="INPUT"
          || document.activeElement.tagName=="TEXTAREA") {
          document.activeElement.scrollIntoView(true);
        }
      });

      $(window).on('orientationchange', this.onOrientationChange);
    }

    $("#landscape").css({display:"flex"}).hide();

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

  onOrientationChange = (event?) => {

    let landscape = $("#landscape"),
        portrait = $("#portrait");

    switch(window.orientation)
    {
      case -90:
        portrait.hide(100, () => {
          landscape.show();
        });
        break;
      case 90:
        portrait.hide(100, () => {
          landscape.show();
        });
        break;
      default:
        landscape.hide(100, () => {
          portrait.show();
        });
        break;
    }
  };

  ngAfterViewInit() {
    this.onOrientationChange();
    // a11yChecker();
  }

  ngAfterViewChecked(): void {
  }
}
