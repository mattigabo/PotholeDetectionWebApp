import {MapAddict} from "./map-addict";
import {LatLng, LatLngExpression, LayerGroup, Marker} from "leaflet";
import {DistributionService, Entry} from "../services/distribution/distribution.service";
import {MapsWrapper} from "./maps.wrapper";
import {HeatLayer} from "./heat.layer";

export class HeatmapUpdater extends MapAddict {

  protected static readonly HEAT_MAP_ID = "default-heat-map";

  constructor(private _dst: DistributionService) {
    super();
  }

  populateLayer(latLngs: LatLngExpression[],
                group: LayerGroup,
                markerGenerator: (LatLngExpression) => Marker) {

    super.populateLayer(latLngs, group, markerGenerator);
    this.updateHeatMap(latLngs);
  }

  protected initHeatMap(heatMap : HeatLayer) {
    this.hideAllLayers();

    this.wrapper.add(
      HeatmapUpdater.HEAT_MAP_ID,
      heatMap.display([]),
      this.heat_group
    );

    this.showAllLayers();
  }

  protected updateHeatMap(data?: any) {
    this._dst.submit(new Entry(MapsWrapper.ACTION.UPDATE_HEATMAP, data));
  }

  private isHeatMapVisible(): boolean {
    let heat_map = this.wrapper.heatLayer(HeatmapUpdater.HEAT_MAP_ID);

    return  heat_map != undefined && heat_map.isVisible;
  }

  protected showUserDefinedLayer(): void {
    if(this.isHeatMapVisible()) {
      this.isUserHidden = false;
      this.updateHeatMap(null)
    } else {
      super.showUserDefinedLayer();
    }
  }

  protected showFetchedLayer(): void {
    if(this.isHeatMapVisible()) {
      this.isFetchedHidden = false;
      this.updateHeatMap(null)
    } else {
      super.showFetchedLayer();
    }
  }

  protected showDefaultLayer(): void {
    if(this.isHeatMapVisible()) {
      this.isDefaultHidden = false;
      this.updateHeatMap(null);
    } else {
      super.showDefaultLayer();
    }
  }

  protected hideUserDefinedLayer(): void {
    super.hideUserDefinedLayer();
    this.updateHeatMap(null)
  }

  protected hideDefaultLayer(): void {
    super.hideDefaultLayer();
    this.updateHeatMap(null)
  }

  protected hideFetchedLayer(): void {
    super.hideFetchedLayer();
    this.updateHeatMap(null)
  }
}
