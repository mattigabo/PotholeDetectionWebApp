'use strict';

export let simpleheat = (canvas) => new SimpleHeat(canvas);

export class SimpleHeat {

  defaultRadius: 25;

  public static defaultGradient: {
    0.4: 'blue',
    0.6: 'cyan',
    0.7: 'lime',
    0.8: 'yellow',
    1.0: 'red'
  };

  private _canvas: HTMLCanvasElement;
  private _ctx: any;
  private _width: number;
  private _height: number;
  private _max: number;
  private _data: any[];
  private _radius: number;
  private _circle: any;
  private _grad: Uint8ClampedArray;

  constructor (canvas) {
    this._canvas = canvas = typeof canvas === 'string' ?
      document.getElementById(canvas) : canvas;

    this._ctx = canvas.getContext('2d');
    this._width = canvas.width;
    this._height = canvas.height;

    this._max = 1;
    this._data = [];
    this._radius = 0;
  }


  set width(value: number) {
    this._width = value;
  }

  set height(value: number) {
    this._height = value;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get radius(): number {
    return this._radius;
  }

  public setData(data) : SimpleHeat{
    this._data = data;
    return this;
  };

  public setMax(max) : SimpleHeat{
    this._max = max;
    return this;
  };

  public add(point) : SimpleHeat{
    this._data.push(point);
    return this;
  };

  public clear() : SimpleHeat{
    this._data = [];
    return this;
  };

  // Ex-Radius Function
  public area(radius, blur?) : SimpleHeat{
    blur = blur === undefined ? 15 : blur;

    // create a grayscale blurred circle image that we'll use for drawing points
    let circle = this._circle = this._createCanvas(),
      ctx = circle.getContext('2d'),
      r2 = this._radius = radius + blur;

    circle.width = circle.height = r2 * 2;

    ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
    ctx.shadowBlur = blur;
    ctx.shadowColor = 'black';

    ctx.beginPath();
    ctx.arc(-r2, -r2, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    return this;
  };

  public resize(){
    this._width = this._canvas.width;
    this._height = this._canvas.height;
  };

  public gradient(grad) : SimpleHeat {
    // create a 256x1 gradient that we'll use to turn a grayscale heat_group into a colored one
    let canvas = this._createCanvas(),
      ctx = canvas.getContext('2d'),
      gradient = ctx.createLinearGradient(0, 0, 0, 256);

    canvas.width = 1;
    canvas.height = 256;

    for (var i in grad) {
      gradient.addColorStop(+i, grad[i]);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 256);

    this._grad = ctx.getImageData(0, 0, 1, 256).data;

    return this;
  };

  public draw(minOpacity)  : SimpleHeat {
    if (!this._circle) this.area(this.defaultRadius);
    if (!this._grad) this.gradient(SimpleHeat.defaultGradient);

    var ctx = this._ctx;

    ctx.clearRect(0, 0, this._width, this._height);

    // draw a grayscale heat_group by putting a blurred circle at each setData point
    for (var i = 0, len = this._data.length, p; i < len; i++) {
      p = this._data[i];
      ctx.globalAlpha = Math.min(Math.max(p[2] / this._max, minOpacity === undefined ? 0.05 : minOpacity), 1);
      ctx.drawImage(this._circle, p[0] - this._radius, p[1] - this._radius);
    }

    // colorize the heat_group, using opacity value of each pixel to get the right color from our gradient
    let colored = ctx.getImageData(0, 0, this._width, this._height);
    this._colorize(colored.data, this._grad);
    ctx.putImageData(colored, 0, 0);

    return this;
  };

  private _colorize(pixels, gradient){
    for (var i = 0, len = pixels.length, j; i < len; i += 4) {
      j = pixels[i + 3] * 4; // get gradient color from opacity value

      if (j) {
        pixels[i] = gradient[j];
        pixels[i + 1] = gradient[j + 1];
        pixels[i + 2] = gradient[j + 2];
      }
    }
  };

  private _createCanvas(){
    if (typeof document !== 'undefined') {
      return document.createElement('canvas');
    } else {
      // create a new canvas instance in node.js
      // the canvas class needs to have a default constructor without any parameter
      // @ts-ignore
      return new this._canvas.constructor();
    }
  };
}
