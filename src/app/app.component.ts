import { Component } from '@angular/core';
import * as $ from 'jquery';
import {Toast, ToasterConfig, ToasterService} from "angular2-toaster";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  public potholeSystemToastConfig : ToasterConfig = new ToasterConfig({
    positionClass: 'toast-bottom-left',
    timeout:3000,
    animation: 'fade',
    showCloseButton: true
  });

  constructor(private toaster: ToasterService) {

    $(document).ready(function (readyEvent) {

      /** HERE DOCUMENT EVENT LISTENER **/
      $(document).on('keyup', function (keyEvent) {
        let key = keyEvent.key ? keyEvent.key.toUpperCase() : keyEvent.which;

        if (key === "ESCAPE") {
          $('.close-on-esc').each(function (idx, obj) {
            $(obj).hide();
          });

          $('.open-on-esc').each(function (idx, obj) {
            $(obj).show();
          });
        }
      });
    });
  }
}
