import {
  GraphResponseModelStake,
  GraphResponseModelRedeem,
  GraphResponseModelBase,
} from './../model/graph.model';
import { ApiStakeData } from './../model/stake.model';
import { RequestsService } from './requests.service';
import { Injectable } from '@angular/core';
import { Subject, timer, forkJoin, Observable } from 'rxjs';
import { map, mergeMap, retry } from 'rxjs/operators';

export interface Graph {
  stake: GraphResponseModelStake[];
  redeem: GraphResponseModelRedeem[];
  cooldown: GraphResponseModelBase[];
  claimrewards: GraphResponseModelBase[];
}

@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  refreshInterval: number = 10000;

  stakeData: ApiStakeData;
  stakeData$: Subject<ApiStakeData> = new Subject();
  stakeDataError$: Subject<string> = new Subject();

  constructor(private requestsService: RequestsService) {
    this.getProviderLoop().subscribe(
      (data) => {
        this.stakeData = data;
        this.stakeData$.next(data);
        this.stakeDataError$.next(null);
      },
      (err) => {
        this.stakeDataError$.next(err);
      }
    );
  }

  private getProviderLoop() {
    return timer(0, this.refreshInterval).pipe(
      mergeMap(() => this.requestsService.getData())
    );
  }

  getGasLimits() {
    return this.requestsService.getGasLimits().pipe(retry(3));
  }

  getGraph(fromDate: Date, toDate: Date): Observable<Graph> {
    let tasks$ = [
      this.requestsService
        .getGraph({ collection: 'stake', fromDate: fromDate, toDate: toDate })
        .pipe(retry(3)),
      this.requestsService
        .getGraph({ collection: 'redeem', fromDate: fromDate, toDate: toDate })
        .pipe(retry(3)),
      this.requestsService
        .getGraph({
          collection: 'cooldown',
          fromDate: fromDate,
          toDate: toDate,
        })
        .pipe(retry(3)),
      this.requestsService
        .getGraph({
          collection: 'claimrewards',
          fromDate: fromDate,
          toDate: toDate,
        })
        .pipe(retry(3)),
    ];
    return forkJoin(tasks$).pipe(
      map((res) => {
        return {
          stake: res[0] as GraphResponseModelStake[],
          redeem: res[1] as GraphResponseModelRedeem[],
          cooldown: res[2],
          claimrewards: res[3],
        };
      })
    );
  }
}
