import { ApiGasLimitsData } from './../model/stake.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StakeData } from '../model/stake.model';
import { DataProviderService } from '../service/data-provider.service';

@Component({
  selector: 'app-gas',
  templateUrl: './gas.component.html',
  styleUrls: ['./gas.component.scss']
})
export class GasComponent implements OnInit, OnDestroy {
  stakeData: StakeData;
  gasLimitsData: ApiGasLimitsData;
  gasLimitsErrRetryCnt: number = 0;

  error: string;

  providerSubs: Subscription[] = [];

  gweiInput: number = null;

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
    this.providerSubs.push(
      this.dataProviderService.getGasLimits().subscribe(data => {
        this.gasLimitsData = data;
        this.gasLimitsErrRetryCnt = 0;
      }, err => {
        this.gasLimitsErrRetryCnt += 1;
      })
    );
  }

  ngOnDestroy() {
    this.providerSubs.forEach(s => s?.unsubscribe());
  }

  get gasPrice() {
    return this.stakeData.apiStakeData.response.gas_price;
  }

  get glStake() {
    return this.gasLimitsData?.response.gas_limit_stake;
  }

  get glClaimRewards() {
    return this.gasLimitsData?.response.gas_limit_claimRewards;
  }

  get glCooldown() {
    return this.gasLimitsData?.response.gas_limit_cooldown;
  }

  get glRedeem() {
    return this.gasLimitsData?.response.gas_limit_redeem;
  }

  get ethPrice() {
    return this.stakeData.apiStakeData.response.eth_price;
  }

}
