import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StakeData } from '../model/stake.model';
import { DataProviderService } from '../service/data-provider.service';

@Component({
  selector: 'app-gas',
  templateUrl: './gas.component.html',
  styleUrls: ['./gas.component.css']
})
export class GasComponent implements OnInit, OnDestroy {
  stakeData: StakeData;

  error: string;

  providerSubs: Subscription[] = new Array(2);

  constructor(private dataProviderService: DataProviderService) { }

  ngOnInit(): void {
    if (this.dataProviderService.stakeData) {
      this.stakeData = new StakeData(this.dataProviderService.stakeData);
    }
    this.providerSubs.push(
      this.dataProviderService.stakeData$.subscribe((res) => {
        this.stakeData = new StakeData(res);
      })
    );
    this.providerSubs.push(
      this.dataProviderService.stakeDataError$.subscribe((err) => {
        this.error = err;
      })
    );
  }

  ngOnDestroy() {
    this.providerSubs.forEach(s => s?.unsubscribe());
  }

  get gas() {
    return this.stakeData.apiStakeData.response.gas_price;
  }

}
