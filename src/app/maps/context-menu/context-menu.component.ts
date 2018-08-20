import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LAYER_NAME, MapSingleton} from "../../map-singleton";
import * as $ from "jquery";
import L from 'leaflet';
import {CoordinatesOverlay} from "../coordinates/coordinates-overlay";
// import {FeaturesService} from "../leaflet.extensions";

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit, AfterViewInit {
  private osmMap: L.Map;
  private layers: L.LayerGroup;
  private index: number[];

  private _coordinates : L.LatLng;

  public set coordinates (coordinates : L.LatLng)  {
    this._coordinates = coordinates;
  };

  public get coordinates () {
    return this._coordinates;
  }

  constructor(
    // private map: L.Map
  ) { }

  ngOnInit() {
    $(document).ready(() => {

    });
  }

  ngAfterViewInit(): void {
    let that = this;

    $(document).ready(() => {

      this.osmMap = MapSingleton.instance().map();
      this.layers = MapSingleton.instance().layers();
      this.index = MapSingleton.instance().index();

      // console.log(this.index);
      // console.log(this.osmMap);
      // console.log(this.layers);

      let user_defined : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.USER_DEFINED]);
      let fetched : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.FETCHED]);
      let area_selected : L.FeatureGroup = this.layers.getLayer(this.index[LAYER_NAME.AREA_SELECTED]);
      let geometry : L.LayerGroup = this.layers.getLayer(this.index[LAYER_NAME.GEOMETRY]);

      this.osmMap.on('contextmenu', function (contextEvent) {
        CoordinatesOverlay.showCoordinates(contextEvent.latlng, false);

        that.coordinates = contextEvent.latlng;

        $('.context-menu').css({
          display: "grid",
          transaction: 0.5,
          top: (contextEvent.containerPoint.y + 10).toString() + "px",
          left: (contextEvent.containerPoint.x + 10).toString() + "px"
        });
      });

      $('#add-marker').on('click', function () {
        L.marker(that.coordinates).addTo(user_defined);

        $('.context-menu').fadeOut(100);
      });

      $('#add-area-selector').on('click', function () {
        // TO DO
        $('.context-menu').fadeOut(100);
      });

      $('#clear-layers').on('click', function () {
        user_defined.clearLayers();
        fetched.clearLayers();
        area_selected.clearLayers();
        $('.context-menu').fadeOut(100);
      });

    });
  }


}
