import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, timer } from 'rxjs';
import { map, switchMap, take, catchError } from 'rxjs/operators';
import { RefreshLimitError } from 'src/app/common/errors/refresh-limit.error';

export interface EtherscanResponse {
  status: string;
  message: string;
  result: string;
}

@Injectable({
  providedIn: 'root'
})
export class EtherscanService {
  private SUBSCRIPTION_DELAY = 6000;
  private URL = "https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x4da27a545c0c5b758a6ba100e3a049001de870f5";

  /* MOCK */
  /* private URL = "http://localhost:4200/assets/mock-success.json"; */
  /* private URL = "http://localhost:4200/assets/mock-error.json"; */

  constructor(private http: HttpClient) { }

  getTokenSupply() {
    return this.http.get(this.URL)
      .pipe(
        map((response: EtherscanResponse) => {
          if (response.status == "0") {
            throw new RefreshLimitError();
          }
          if (response.status != "1") {
            throw new Error(response.message + " " + response.result);
          }
          return {
            status: response.status,
            message: response.message,
            result: response.result.substr(0, response.result.length - 18) + "." + response.result.substr(response.result.length - 18)
          };
        })
      );
  }

  getSubscription() {
    return timer(0, this.SUBSCRIPTION_DELAY).pipe(
      switchMap(() => this.getTokenSupply().pipe(
          catchError(e => {
            console.log(e);
            return of(e)
          })
      ))
      );
  }

  getRefreshTimer() {
    return timer(0, 1000).pipe(
      map(i => this.SUBSCRIPTION_DELAY / 1000 - i),
      take(this.SUBSCRIPTION_DELAY / 1000 + 1)
    );
  }
}
