export interface ApiStakeData {
  code: number;
  response: {
    stake_emission_per_second: string;
    stake_total: string;
    gas_price: {
      LastBlock: string;
      SafeGasPrice: string;
      ProposeGasPrice: string;
      FastGasPrice: string;
    };
    eth_price: string;
    aave_price: string;
    timestamp: Date;
  };
}

export interface ApiGasLimitsData {
  code: number;
  response: {
    gas_limit_stake: number;
    gas_limit_claimRewards: number;
    gas_limit_cooldown: number;
    gas_limit_redeem: number;
  };
}

export class StakeData {
  stakeTotal: number;
  stakeEmissionPerSecond: number;
  stakeEmissionPerDay: number;
  stakeEmissionPerDayCustom: number;
  apy: number;
  apyCustom: number;

  constructor(
    public apiStakeData: ApiStakeData,
    stakeEmissionPerDayCustom?: number
  ) {
    this.stakeTotal = +apiStakeData.response.stake_total * 10e-19;

    this.stakeEmissionPerSecond =
      +apiStakeData.response.stake_emission_per_second * 10e-19;
    this.stakeEmissionPerDay = this.stakeEmissionPerSecond * 86400;

    this.stakeEmissionPerDayCustom = stakeEmissionPerDayCustom;

    this.apy = (this.stakeEmissionPerDay / this.stakeTotal) * 365;
    this.apyCustom = (this.stakeEmissionPerDayCustom / this.stakeTotal) * 365;
  }

  calcProfit(valInPool: number, valNotInPool: number): CalcData {
    let usingEmission = this.stakeEmissionPerDayCustom
      ? this.stakeEmissionPerDayCustom
      : this.stakeEmissionPerDay;
    let dailyProfitCentile = usingEmission / (this.stakeTotal + valNotInPool);
    let _daily = dailyProfitCentile * (valInPool + valNotInPool);
    return {
      newApy: dailyProfitCentile * 365,
      daily: _daily,
      weekly: _daily * 7,
      monthly: _daily * 30,
      yearly: _daily * 365,
    };
  }

  get lastRefresh() {
    return this.apiStakeData.response.timestamp;
  }

  get hasCustom() {
    return this.stakeEmissionPerDayCustom ? true : false;
  }
}

export interface CalcData {
  newApy: number;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}
