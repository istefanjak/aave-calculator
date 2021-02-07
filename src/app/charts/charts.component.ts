import { DateCreator, ChartDataModel } from './../model/graph.model';
import { DataProviderService, Graph } from './../service/data-provider.service';
import { Component, OnInit } from '@angular/core';

class GraphContainer {
  private _countGraph;
  private _gasAvgGraph;
  private _gasTotalGraph;
  private _stakeRedeemTotalGraph;

  private dataInit: ChartDataModel[] = [
    { name: 'Stake', series: [] },
    { name: 'Redeem', series: [] },
    { name: 'Cooldown', series: [] },
    { name: 'Claim rewards', series: [] },
  ];

  private dataInit2: ChartDataModel[] = [
    { name: 'Stake', series: [] },
    { name: 'Redeem', series: [] },
  ];

  constructor(public res: Graph) {}

  private _helper(ret: ChartDataModel[], attr: string) {
    this.res.stake.forEach((e) =>
      ret[0].series.push({ name: e.date, value: e[attr] })
    );
    this.res.redeem.forEach((e) =>
      ret[1].series.push({ name: e.date, value: e[attr] })
    );
    this.res.cooldown.forEach((e) =>
      ret[2].series.push({ name: e.date, value: e[attr] })
    );
    this.res.claimrewards.forEach((e) =>
      ret[3].series.push({ name: e.date, value: e[attr] })
    );
    ret.forEach((d) => d.series.sort((a, b) => a.name.localeCompare(b.name)));
  }

  get countGraph() {
    if (!this._countGraph) {
      let ret = JSON.parse(JSON.stringify(this.dataInit));
      this._helper(ret, 'transactionCnt');
      this._countGraph = ret;
    }
    return this._countGraph;
  }

  get gasAvgGraph() {
    if (!this._gasAvgGraph) {
      let ret = JSON.parse(JSON.stringify(this.dataInit));
      this._helper(ret, 'transactionCostAvg');
      this._gasAvgGraph = ret;
    }
    return this._gasAvgGraph;
  }

  get gasTotalGraph() {
    if (!this._gasTotalGraph) {
      let ret = JSON.parse(JSON.stringify(this.dataInit));
      this._helper(ret, 'transactionCostTotal');
      this._gasTotalGraph = ret;
    }
    return this._gasTotalGraph;
  }

  get stakeRedeemTotalGraph() {
    if (!this._stakeRedeemTotalGraph) {
      let ret = JSON.parse(JSON.stringify(this.dataInit2));
      this.res.stake.forEach((e) =>
        ret[0].series.push({ name: e.date, value: e.stakeAmountTotal })
      );
      this.res.redeem.forEach((e) =>
        ret[1].series.push({ name: e.date, value: e.unstakeAmountTotal })
      );
      ret.forEach((d) => d.series.sort((a, b) => a.name.localeCompare(b.name)));
      this._stakeRedeemTotalGraph = ret;
    }
    return this._stakeRedeemTotalGraph;
  }
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  data: GraphContainer;
  selected: { type: string; timeSpan: number } = {
    type: undefined,
    timeSpan: undefined,
  };

  isLoading: boolean = true;
  error: string;

  constructor(private dataProviderService: DataProviderService) {}

  ngOnInit(): void {
    this.getData(7);
    this.selected.type = 'count';
  }

  getData(dayNum: number) {
    this.selected.timeSpan = dayNum;
    const dateObj = new DateCreator().getLastDays(dayNum);
    this.error = undefined;
    this.isLoading = true;
    return this.dataProviderService
      .getGraph(dateObj.fromDate, dateObj.toDate)
      .subscribe(
        (res) => {
          this.data = new GraphContainer(res);
          this.error = undefined;
          this.isLoading = false;
        },
        (err) => {
          this.error = 'Server error';
          this.isLoading = false;
        }
      );
  }

  setChart(type: string) {
    if (this.isLoading || this.error) return;

    this.selected.type = type;
  }

  onChange(val) {
    console.log(val);

  }
}
