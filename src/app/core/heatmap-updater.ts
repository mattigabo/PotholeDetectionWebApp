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

  protected updateHeatmap(data?: LatLngExpression[]) {
    this._dst.submit(new Entry(MapsWrapper.ACTION.UPDATE_HEATMAP, data));
  }

}
