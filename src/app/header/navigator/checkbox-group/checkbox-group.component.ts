import { Component, OnInit } from '@angular/core';
import {MapAddict} from "../../../core/map-addict";
import {DistributionService} from "../../../services/distribution/distribution.service";
import {MapsWrapper} from "../../../core/maps.wrapper";
import {WindowService} from "../../../services/window/window.service";
import * as $ from 'jquery';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.css']
})
export class CheckboxGroupComponent extends MapAddict implements OnInit {

  routeChecked: boolean;
  userDefinedChecked: boolean;
  systemDefinedChecked: boolean;
  fetchedChecked: boolean;

  constructor(private _distService: DistributionService,
              private _windower: WindowService) {
    super();
    this.routeChecked = true;
    this.userDefinedChecked = true;
    this.systemDefinedChecked = true;
    this.fetchedChecked = true;

    _distService.subscribe(entry => {
      if (entry.key === MapsWrapper.name &&
        entry.value instanceof MapsWrapper) {

        super.init(entry.value);
        console.log(_windower.height, _windower.width);

        console.log("Checkbox Group Component Ready!");
      }
    });
  }

  ngOnInit() {
  }

  onRouteClicked(event: any) {
    this.routeChecked ? this.showRoute() : this.hideRoute();
  }

  onFetchedClicked(event: any) {
    this.fetchedChecked ? this.showFetchedMarkers() : this.hideFetchedMarkers();
  }

  onUserDefinedClicked(event: any) {
    this.userDefinedChecked ? this.showUserDefinedMarkers() : this.hideUserDefinedMarkers();
  }

  onSystemDefinedClicked(event: any) {
    this.systemDefinedChecked ? this.showSystemDefinedMarkers() : this.hideSystemDefinedMarkers();
  }

  toggleCheckboxContainer(event?) {
    $('.filters-nav-form').each((idx, obj) => $(obj).hide(300));

    this.toggle($('#checkbox-container'));
  }

  private toggle (el) {
    if (el.css('display') === 'none') {
      el.css({display:'flex'}).hide().show(300);
    } else {
      el.hide(300);
    }
  }

}
