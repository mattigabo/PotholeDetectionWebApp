import { Component, OnInit } from '@angular/core';
import {MapAddict} from "../../map-addict";
import {DistributionService} from "../../services/distribution/distribution.service";
import {MapsWrapper} from "../maps.wrapper";
import {WindowService} from "../../services/window/window.service";


@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.css']
})
export class CheckboxGroupComponent extends MapAddict implements OnInit {

  routeChecked:boolean;
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

  onRouteClicked(event: any){
    this.routeChecked ? this.showRoute() : this.hideRoute();
  }

  onFetchedClicked(event: any){
    this.fetchedChecked ? this.showFetchedMarkers() : this.hideFetchedMarkers();
  }

  onUserDefinedClicked(event: any){
    this.userDefinedChecked ? this.showUserDefinedMarkers() : this.hideUserDefinedMarkers();
  }

  onSystemDefinedClicked(event: any){
    alert("easter egg: not implemented! TOLLOL");
  }
}
