import {EventEmitter, Injectable} from '@angular/core';

export class Entry<K, V> {

  constructor(private _key: K,
              private _value: V) {
  }

  get key() : K { return this._key}

  get value() : V { return this._value}

}

@Injectable({
  providedIn: 'root'
})
export class DistributionService {

  private mapRefEmitter : EventEmitter<Entry<string, any>> = new EventEmitter(true);

  constructor() { }

  submit(event : Entry<string, any>) {
    this.mapRefEmitter.emit(event);
  }

  subscribe(handler : (entry: Entry<string, any>) => void, onComplete? : any, onError? : any) {
    this.mapRefEmitter.subscribe(handler, onError, onComplete);
  }
}
