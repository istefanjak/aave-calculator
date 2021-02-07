export interface GraphRequestModel {
  collection: string;
  fromDate: Date;
  toDate: Date;
}

export interface GraphResponseModelBase {
  transactionCnt: number;
  gasPriceAvg: number;
  gasUsedAvg: number;
  transactionCostAvg: number;
  transactionCostTotal: number;
  date: string;
  action: string;
}

export interface GraphResponseModelStake extends GraphResponseModelBase {
  stakeAmountTotal: number;
}

export interface GraphResponseModelRedeem extends GraphResponseModelBase {
  unstakeAmountTotal: number;
}

export class DateCreator {
  getLastDays(days: number) {
    let now = new Date();

    let past = new Date();
    let dateOffset = 24 * 60 * 60 * 1000 * (days - 1);
    past.setTime(past.getTime() - dateOffset);

    return { fromDate: past, toDate: now };
  }
}

// CHART DATA
export interface ChartDataModel {
  name: string;
  series: { name: any, value: number }[];
}
