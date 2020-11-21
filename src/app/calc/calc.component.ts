import { RefreshLimitError } from './../common/errors/refresh-limit.error';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EtherscanService } from '../service/etherscan/etherscan.service';

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.css']
})
export class CalcComponent implements OnInit, OnDestroy {
  dailyReward: number = 400.;
  staked;
  apy;
  calculation;

  showDailyRewardChangeNote = false;

  etherScanError = {
    error: undefined,
    timer: 0,
    isTooManyRequests: function () { return this.error instanceof RefreshLimitError },
    setError: function (error: Error, timerObservable: Observable<Number>) {
      this.error = error;
      timerObservable.subscribe(i => this.timer = i);
    },
    unsetError: function () { this.error = undefined; this.timer = 0; }
  }
  calculatorError: String;

  subscription: Subscription;


  calcForm = new FormGroup({
    ownedNum: new FormControl(''),
    ownedNumNotPool: new FormControl('')
  });

  lastCalcForm: FormGroup;

  constructor(private etherscanService: EtherscanService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initDailyReward();
    this.subscription = this.etherscanService.getSubscription().subscribe(
      (response) => {
        this.showDailyRewardChangeNote = false;
        if (response instanceof Error) {
          this.etherScanError.setError(response, this.etherscanService.getRefreshTimer());
          return;
        }

        this.etherScanError.unsetError();
        this.staked = response.result;
        this.apy = this.dailyReward / this.staked * 365;
        if (this.lastCalcForm) this.refresh(this.lastCalcForm);

      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initDailyReward() {
    
    let p = this.route.snapshot.params.dailyInit;
    if (p) this.dailyReward = p;
  }

  onCalculate() {
    this.refresh(this.calcForm);
    this.lastCalcForm = new FormGroup({
      ownedNum: new FormControl(this.calcForm.get('ownedNum').value),
      ownedNumNotPool: new FormControl(this.calcForm.get('ownedNumNotPool').value)
    });
  }

  refresh(formGrp: FormGroup) { 
    let formCtrlOwnedNumNotPool = formGrp.get('ownedNumNotPool');
    let formCtrlOwnedNum = formGrp.get('ownedNum');

    /*if (formGrp.invalid) {
      this.calculation = null;
      return;
    }*/

    if (!formCtrlOwnedNumNotPool.value)
      formCtrlOwnedNumNotPool.setValue(0);

    if (!formCtrlOwnedNum.value)
      formCtrlOwnedNum.setValue(0);

    let valNotPool = +formCtrlOwnedNumNotPool.value;
    let valPool = +formCtrlOwnedNum.value;

    let dailyProfitCentile = this.dailyReward / (+this.staked + valNotPool);
    let daily_ = dailyProfitCentile * (valPool + valNotPool);
    let newApy = this.dailyReward / (+this.staked + valNotPool) * 365;
  
    
    
    this.calculatorError = null;
    this.calculation = {
      apy: newApy,
      daily: daily_,
      weekly: daily_ * 7,
      monthly: daily_ * 30,
      yearly: daily_ * 365
    };
  }

  onDailyRewardInput() {
    this.showDailyRewardChangeNote = true;
  }
}
