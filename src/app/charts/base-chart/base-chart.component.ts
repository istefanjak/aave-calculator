import { Component, Input } from '@angular/core';
import { ChartDataModel } from 'src/app/model/graph.model';

@Component({
  selector: 'app-base-chart',
  templateUrl: './base-chart.component.html',
  styleUrls: ['./base-chart.component.scss'],
})
export class BaseChartComponent {
  @Input() data: ChartDataModel[] = [];

  // options
  legend: boolean = true;
  legendPosition: string = 'below';
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#ffa500', '#7aa3e5', '#a8385d', '#aae3f5'],
  };

  constructor() {}

}
