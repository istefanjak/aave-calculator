import { EtherscanResponse, EtherscanService } from './../etherscan.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.css']
})
export class CalcComponent implements OnInit, OnDestroy {
  dailyReward = 400.;
  staked;
  apy;
  calculation;
  error;
  subscription: Subscription;

  ownedNum = new FormControl('');
  lastOwnedNum;

  constructor(private etherscanService: EtherscanService) { }

  ngOnInit(): void {
    this.subscription = timer(0, 6000).pipe(
      switchMap(() => this.etherscanService.getTokenSupply())
    ).subscribe((response: EtherscanResponse) => {
      this.staked = response.result;
      this.apy = this.dailyReward / this.staked * 365 * 100;
      if (this.lastOwnedNum) this.refresh(this.lastOwnedNum);

    }, error => {
      this.staked = error;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onCalculate() {
    console.log("onCalculate()");
    this.refresh(this.ownedNum);
    this.lastOwnedNum = new FormControl(this.ownedNum.value);
  }

  refresh(value) {
    console.log(this.lastOwnedNum);
    if (value.errors) {
      this.calculation = null;
      this.error = "Please enter valid value!";
      return;
    }

    let dailyProfitCentile = this.dailyReward / this.staked;
    let val = +value.value;
    this.error = null;
    this.calculation = {
      daily: dailyProfitCentile * val,
      weekly: dailyProfitCentile * val * 7,
      monthly: dailyProfitCentile * val * 30,
      yearly: dailyProfitCentile * val * 365
    };
  }

  isNumber(val): boolean {
    return !isNaN(val);
  }
}
