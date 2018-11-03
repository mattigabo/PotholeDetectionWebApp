import {Component, OnInit} from '@angular/core';
import {DistributionService, Entry} from "../../../services/distribution/distribution.service";
import {LAYER_NAME, MapsWrapper} from "../../../core/maps.wrapper";
import {WindowService} from "../../../services/window/window.service";
import * as $ from 'jquery';
import * as Leaflet from 'leaflet';
import {LatLng} from 'leaflet';
import {HeatmapUpdater} from "../../../core/heatmap-updater";
import {Custom} from "../../../core/custom";
import {MapAddict} from "../../../core/map-addict";

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.css']
})
export class CheckboxGroupComponent extends HeatmapUpdater implements OnInit {

  userColor = Custom.userColor;
  serverColor = Custom.serverColor;
  fetchedColor = Custom.fetchedColor;

  routeChecked: boolean;
  userDefinedChecked: boolean;
  systemDefinedChecked: boolean;
  fetchedChecked: boolean;

  constructor(private _distService: DistributionService,
              private _windower: WindowService) {
    super(_distService);
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

      } else if (entry.key === MapsWrapper.ACTION.LAYERS_DISPLAY
        && typeof(entry.value)  === "string"){

        this._switchLayersDisplay(entry.value);

      } else if (entry.key == MapsWrapper.ACTION.UNCHECK_SYSTEM_LAYER){
        this.systemDefinedChecked = false;
      }
    });
  }

  ngOnInit() {
  }

  onRouteClicked(event: any) {
    this.routeChecked ? this.showRouteLayerOrdered() : this.hideRouteLayer();
  }

  onFetchedClicked(event: any) {
      this._distService.submit(new Entry(MapsWrapper.ACTION.LAYERS_DISPLAY, LAYER_NAME.FETCHED))

  }

  onUserDefinedClicked(event: any) {
      this._distService.submit(new Entry(MapsWrapper.ACTION.LAYERS_DISPLAY, LAYER_NAME.USER_DEFINED))
  }

  onSystemDefinedClicked(event: any) {
    this._distService.submit(new Entry(MapsWrapper.ACTION.LAYERS_DISPLAY, LAYER_NAME.SYSTEM_DEFINED))
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

  private _switchLayersDisplay(layer: string | LAYER_NAME) {
    if (layer === LAYER_NAME.FETCHED) {
      this.fetchedChecked ?
        this.isHeatMapVisible() ?
          this.showFetchedLayer() :
          this.showFetchedLayerOrdered() :
        this.hideFetchedLayer();
    } else if (layer === LAYER_NAME.USER_DEFINED) {
      this.userDefinedChecked ?
        this.isHeatMapVisible() ?
          this.showUserDefinedLayer() :
          this.showUserDefinedLayerOrdered() :
        this.hideUserDefinedLayer();
    } else if (layer === LAYER_NAME.SYSTEM_DEFINED) {
      // console.log(this.systemDefinedChecked);
      this.systemDefinedChecked ?
        this.isHeatMapVisible() ?
          this.showDefaultLayer() :
          this.showDefaultLayerOrdered() :
        this.hideDefaultLayer();
    }
  }

}
