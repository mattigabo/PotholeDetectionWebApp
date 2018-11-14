import { Injectable } from '@angular/core';

declare var Fingerprint2:any;

@Injectable({
  providedIn: 'root'
})
export class FingerprintService {

  private static fingerprint  : string = "";
  private static browser_data  : any;

  constructor() {}

  public generateGUID () : Promise<String> {
    return Fingerprint2
      .getPromise(Fingerprint2.defaultOptions)
      .then(
        components => {
          FingerprintService.browser_data = components;
          FingerprintService.fingerprint = Fingerprint2.x64hash128(components.map(component => component.value).join(''), 31);
          // console.log("YOUR GUID: ", FingerprintService.fingerprint);
          return FingerprintService.fingerprint;
        },
        () => {
          console.log("ERROR generating fingerprint token")
        }
      );
  }

  public getGUID () : string {
    return FingerprintService.fingerprint;
  }

}
