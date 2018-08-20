import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor() {
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

  ngOnInit(): void {
    $(document).ready(() => {

    });
  }
}
