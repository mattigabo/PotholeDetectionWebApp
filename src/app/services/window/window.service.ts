import {EventEmitter, Injectable} from '@angular/core';
import {Entry} from "../distribution/distribution.service";

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  private _height: number;
  private _width: number;
  private _only_once: boolean = true;

  constructor() {
  }

  public setWindowMaxDimensions(height: number, width: number) {
    if (this._only_once) {
      this._height = height;
      this._width = width;
      this._only_once = false;
    }

  }

  get width(): number {
    return this._width;
  }
  get height(): number {
    return this._height;
  }
}
