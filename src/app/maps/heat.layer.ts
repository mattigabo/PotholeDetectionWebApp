'use strict';
import * as L from "leaflet";
import {simpleheat, SimpleHeat} from "./simpleheat";
import "jquery"
import {LatLng} from "leaflet";

export interface HeatOptions {
  minOpacity?: number,
  maxZoom?: number,
  radius?: number,
  blur?: number,
  max?: number,
  gradient?: object
}

export let defaultOptions : HeatOptions = {
  minOpacity: 0.05,
  maxZoom: 18,
  radius: 25,
  blur: 15,
  max: 1.0,
  gradient: SimpleHeat.defaultGradient
};

export class HeatLayer extends L.Layer {

  private _batch: L.LatLng[];
  private _isVisible: boolean = false;
  private _frame: number;
  private _heat: SimpleHeat;
  private _canvas: HTMLCanvasElement;

  private get cfg() {
    // @ts-ignore
    return this.options
  }

  /**
   * @param _points : Array, an array of <strong>Leaflet.LatLng<\strong>
   * @param options : HeatOptions, the configuration for this heat_group layer
   **/
  constructor(private _points: L.LatLng[] = [],
              options : HeatOptions = defaultOptions) {
    super();
    // Set Options of leaftlet sets a property "options" to this object if undefined
    // else appends the new options to the existent options (Layer optins)
    L.Util.setOptions(this, options || defaultOptions);
  }

  public display(latlngs: LatLng[]){
    this._isVisible = true;
    this._points = latlngs;
    return this.redraw();
  }

  public add(latlng){
    this._points.push(latlng);
    return this.redraw();
  }

  public setOptions(options){
    L.Util.setOptions(this, options);
    if (this._heat) {
      this._updateOptions();
    }
    return this.redraw();
  }

  public redraw(){
    // @ts-ignore
    if (this._heat && !this._frame && this._map && !this._map._animating) {
      this._frame = L.Util.requestAnimFrame(this._redraw, this);
    }
    return this;
  }

  onAdd(map){
    this._map = map;

    if (!this._canvas) {
      this._initCanvas();
    }

    if (this.cfg.pane) {
      this.getPane().appendChild(this._canvas);
    }else{
      map._panes.overlayPane.appendChild(this._canvas);
    }

    map.on('moveend', this._reset, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }

    this._reset();

    return this;
  }

  onRemove(map) {
    if (this.cfg.pane) {
      this.getPane().removeChild(this._canvas);
    }else{
      map.getPanes().overlayPane.removeChild(this._canvas);
    }

    map.off('moveend', this._reset, this);

    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._animateZoom, this);
    }

    return this;
  }

  addTo(map: L.Map | L.LayerGroup) {
    map.addLayer(this);
    return this;
  }

  private _initCanvas() {
    let canvas = this._canvas =
      L.DomUtil.create('canvas', 'leaflet-heat_group-layer leaflet-layer') as HTMLCanvasElement;

    let originProp = L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
    if (originProp) {
      canvas.style[originProp] = '50% 50%';
    }

    let size = this._map.getSize();
    canvas.width = size.x;
    canvas.height = size.y;

    let animated = this._map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

    this._heat = simpleheat(canvas);
    this._updateOptions();
  }

  private _updateOptions() {
    this._heat.area(this.cfg.radius || this._heat.defaultRadius, this.cfg.blur);

    if (this.cfg.gradient) {
      this._heat.gradient(this.cfg.gradient);
    }
    if (this.cfg.max) {
      this._heat.setMax(this.cfg.max);
    }
  }

  private _reset() {
    let topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._canvas, topLeft);

    let size = this._map.getSize();

    if (this._heat.width !== size.x) {
      this._canvas.width = this._heat.width  = size.x;
    }
    if (this._heat.height !== size.y) {
      this._canvas.height = this._heat.height = size.y;
    }

    this._redraw();
  }

  private _redraw() {
    if (!this._map) {
      return;
    }

    let data = [],
      r = this._heat.radius,
      size = this._map.getSize(),
      bounds = new L.Bounds(
        L.point([-r, -r]),
        size.add([r, r])),
      max = this.cfg.max === undefined ? 1 : this.cfg.max,
      maxZoom = this.cfg.maxZoom === undefined ? this._map.getMaxZoom() : this.cfg.maxZoom,
      v = 1 / Math.pow(2, Math.max(0, Math.min(maxZoom - this._map.getZoom(), 12))),
      cellSize = r / 2,
      grid = [],
      // @ts-ignore
      panePos = this._map._getMapPanePos(),
      offsetX = panePos.x % cellSize,
      offsetY = panePos.y % cellSize,
      i, len, p, cell, x, y, j, len2, k;

    // console.time('process');
    for (i = 0, len = this._points.length; i < len; i++) {
      p = this._map.latLngToContainerPoint(this._points[i]);
      if (bounds.contains(p)) {
        x = Math.floor((p.x - offsetX) / cellSize) + 2;
        y = Math.floor((p.y - offsetY) / cellSize) + 2;

        let intensity =
          this._points[i].alt !== undefined ? this._points[i].alt :
            this._points[i][2] !== undefined ? +this._points[i][2] : 1;
        k = intensity * v;

        grid[y] = grid[y] || [];
        cell = grid[y][x];

        if (!cell) {
          grid[y][x] = [p.x, p.y, k];

        } else {
          cell[0] = (cell[0] * cell[2] + p.x * k) / (cell[2] + k); // x
          cell[1] = (cell[1] * cell[2] + p.y * k) / (cell[2] + k); // y
          cell[2] += k; // cumulated intensity value
        }
      }
    }

    for (i = 0, len = grid.length; i < len; i++) {
      if (grid[i]) {
        for (j = 0, len2 = grid[i].length; j < len2; j++) {
          cell = grid[i][j];
          if (cell) {
            data.push([
              Math.round(cell[0]),
              Math.round(cell[1]),
              Math.min(cell[2], max)
            ]);
          }
        }
      }
    }
    // console.timeEnd('process');

    // console.time('draw ' + setData.length);
    this._heat.setData(data).draw(this.cfg.minOpacity);
    // console.timeEnd('draw ' + setData.length);

    this._frame = null;
  }

  private _animateZoom (e) {

    let
      // @ts-ignore
      scale = this._map.getZoomScale(e.zoom),
      // @ts-ignore
      offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

    if (L.DomUtil.setTransform) {
      L.DomUtil.setTransform(this._canvas, offset, scale);

    } else {
      // @ts-ignore
      this._canvas.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
    }
  }

  public show() {
    this._points = this._batch;
    this._batch = [];
  }

  public hide() {
    this._batch = this._points;
    this._points = [];
  }

  public get isVisible() {
    return this._isVisible;
  }

  public clear() {
    this._isVisible = false;
    this._points = [];
    this.redraw();
  }
}

export let heatLayer = (latlngs?: L.LatLng[], options?) => new HeatLayer(latlngs, options);
