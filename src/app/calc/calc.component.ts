import { CalcData } from './../model/stake.model';
import { DataProviderService } from './../service/data-provider.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StakeData } from '../model/stake.model';

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.css'],
})
export class CalcComponent implements OnInit, OnDestroy {
  stakeData: StakeData;
  customEmissionCheckbox: boolean = false;
  customEmission: number;
  calculation: CalcData;

  error: string;

  providerSubs: Subscription[] = new Array(2);
  calcSub: Subscription;

  calcForm: FormGroup;

  constructor(private dataProviderService: DataProviderService) {}

  ngOnInit(): void {
    this.calcForm = new FormGroup({
      ownedNum: new FormControl(null),
      ownedNumNotPool: new FormControl(null),
    });

    if (this.dataProviderService.stakeData) {
      this.stakeData = new StakeData(this.dataProviderService.stakeData, this.customEmission);
    }
    this.providerSubs.push(
      this.dataProviderService.stakeData$.subscribe((res) => {
        this.stakeData = new StakeData(res, this.customEmission);
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
    this.calcSub?.unsubscribe();
  }

  get ownedNum() {
    return this.calcForm.get('ownedNum').value;
  }

  set ownedNum(val: number) {
    this.calcForm.get('ownedNum').setValue(val);
  }

  get ownedNumNotPool() {
    return this.calcForm.get('ownedNumNotPool').value;
  }

  set ownedNumNotPool(val: number) {
    this.calcForm.get('ownedNumNotPool').setValue(val);
  }

  get customEmissionToSend() {
    return this.customEmissionCheckbox && this.customEmission
      ? this.customEmission
      : null;
  }

  onCheckboxClick() {
    if (this.customEmissionCheckbox && this.customEmission) {
      this.refreshStakeData();
    } else {
      this.customEmission = null;
      this.refreshStakeData();
    }
  }

  onCustomEmissionConfirm(val: number) {
    this.customEmission = val;
    this.refreshStakeData();
  }

  onCalculate() {
    if (this.ownedNum === null) this.ownedNum = 0;
    if (this.ownedNumNotPool === null) this.ownedNumNotPool = 0;

    this.calculation = this.stakeData.calcProfit(
      this.ownedNum,
      this.ownedNumNotPool
    );

    this.calcSub?.unsubscribe();
    this.calcSub = this.dataProviderService.stakeData$.subscribe((res) => {
      this.calculation = new StakeData(
        res,
        this.customEmissionToSend
      ).calcProfit(this.ownedNum, this.ownedNumNotPool);
    });
  }

  private refreshStakeData() {
    this.stakeData = new StakeData(
      this.stakeData.apiStakeData,
      this.customEmission
    );
    if (this.calculation) {
      this.calculation = this.stakeData.calcProfit(
        this.ownedNum,
        this.ownedNumNotPool
      );
    }
  }
}
