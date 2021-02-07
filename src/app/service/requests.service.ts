import {
  GraphRequestModel,
  GraphResponseModelBase,
  GraphResponseModelRedeem,
  GraphResponseModelStake,
} from './../model/graph.model';
import { environment } from './../../environments/environment';
import { ApiStakeData, ApiGasLimitsData } from './../model/stake.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  stakeEndpoint: string = environment.apiHostStake;
  gaslimitsEndpoint: string = environment.apiHostGasLimits;
  graphEndpoint: string = environment.apiGraph;

  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get(this.stakeEndpoint).pipe(
      map((res: any) => {
        if (res?.code == 1) return res as ApiStakeData;
        throw new Error(res);
      })
    );
  }

  getGasLimits() {
    return this.http.get(this.gaslimitsEndpoint).pipe(
      map((res: any) => {
        if (res?.code == 1) return res as ApiGasLimitsData;
        throw new Error(res);
      })
    );
  }

  getGraph(
    reqData: GraphRequestModel
  ): Observable<
    | GraphResponseModelBase[]
    | GraphResponseModelStake[]
    | GraphResponseModelRedeem[]
  > {
    return this.http
      .post(this.graphEndpoint, {
        collection: reqData.collection,
        fromDate: reqData.fromDate.getTime(),
        toDate: reqData.toDate.getTime(),
      })
      .pipe(
        map((res: any) => {
          if (res?.code == 1) {
            switch (reqData.collection) {
              case 'stake':
                return res.response as GraphResponseModelStake[];
              case 'redeem':
                return res.response as GraphResponseModelRedeem[];
              default:
                return res.response as GraphResponseModelBase[];
            }
          }
          throw new Error(res);
        })
      );
  }
}
