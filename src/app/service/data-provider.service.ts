import { ApiStakeData } from './../model/stake.model';
import { RequestsService } from './requests.service';
import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  refreshInterval: number = 10000;

  stakeData: ApiStakeData;
  stakeData$: Subject<ApiStakeData> = new Subject();
  stakeDataError$: Subject<string> = new Subject();

  constructor(private requestsService: RequestsService) {
    this.getProviderLoop().subscribe(res => {
      let data = res;
      this.stakeData = data;
      this.stakeData$.next(data);
      this.stakeDataError$.next(null);
    },
    err => {
      this.stakeDataError$.next(err);
    });
  }

  private getProviderLoop() {
    return timer(0, this.refreshInterval).pipe(
      mergeMap(() => this.requestsService.getData())
    );
  }
}
