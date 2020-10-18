import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

export interface EtherscanResponse {
  status: string;
  message: string;
  result: string;
}

@Injectable({
  providedIn: 'root'
})
export class EtherscanService {
  private URL = "https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x4da27a545c0c5b758a6ba100e3a049001de870f5";

  constructor(private http: HttpClient) { }

  getTokenSupply() {
    return this.http.get(this.URL)
                    .pipe(
                      map((response: EtherscanResponse) => ({
                        status: response.status,
                        message: response.message,
                        result: response.result.substr(0, response.result.length-18) + "." + response.result.substr(response.result.length-18)
                      }))
                    );
  }
}
