import { environment } from './../../environments/environment';
import { ApiStakeData, ApiGasLimitsData } from './../model/stake.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  stakeEndpoint: string = environment.apiHostStake;
  gaslimitsEndpoint: string = environment.apiHostGasLimits;

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get(this.stakeEndpoint).pipe(map((res: any) => {
      if (res?.code == 1) return res as ApiStakeData;
      throw new Error(res);
    }))
  }

  getGasLimits() {
    return this.http.get(this.gaslimitsEndpoint).pipe(map((res: any) => {
      if (res?.code == 1) return res as ApiGasLimitsData;
      throw new Error(res);
    }))
  }
}
