import {MapAddict} from "./map-addict";
import {LatLng, LatLngExpression, LayerGroup, Marker} from "leaflet";
import {DistributionService, Entry} from "../services/distribution/distribution.service";
import {MapsWrapper} from "./maps.wrapper";

export class HeatmapUpdater extends MapAddict {

  protected static readonly HEAT_MAP_ID = "default-heat-map";

  constructor(private _dst: DistributionService) {
    super();
  }

  populateLayer(latLngs: LatLngExpression[],
                group: LayerGroup,
                markerGenerator: (LatLngExpression) => Marker) {

    super.populateLayer(latLngs, group, markerGenerator);
    this.updateHeatmap(latLngs);
  }

  protected updateHeatmap(data?: any) {
    this._dst.submit(new Entry(MapsWrapper.ACTION.UPDATE_HEATMAP, data));
  }


  private isHeatMapVisible(): boolean {
    let heat_map = this.wrapper.heatLayer(HeatmapUpdater.HEAT_MAP_ID);

    return  heat_map != undefined && heat_map.isVisible;
  }

  protected showUserDefinedLayer(): void {
    if(this.isHeatMapVisible()) {
      this.user_is_hidden = false;
      console.log("SHIT user")
      this.updateHeatmap(null)
    } else {
      super.showUserDefinedLayer();
    }
  }

  protected showFetchedLayer(): void {
    if(this.isHeatMapVisible()) {
      this.fetched_is_hidden = false;
      this.updateHeatmap(null)
      console.log("SHIT fetch")
    } else {
      super.showFetchedLayer();
    }
  }

  protected showSystemDefinedLayer(): void {
    if(this.isHeatMapVisible()) {
      this.system_defined_is_hidden = false;
      this.updateHeatmap(null)
      console.log("SHIT system")
    } else {
      super.showSystemDefinedLayer();
    }
  }


  protected hideUserDefinedMarkers(): void {
    super.hideUserDefinedMarkers();
    this.updateHeatmap(null)
  }

  protected hideSystemDefinedMarkers(): void {
    super.hideSystemDefinedMarkers();
    this.updateHeatmap(null)
  }

  protected hideFetchedMarkers(): void {
    super.hideFetchedMarkers();
    this.updateHeatmap(null)
  }
}
