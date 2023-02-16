import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  @Input() chartTitle!: string;
  @Input() height?: number | string | null;
  @Input() refElementId?: string; //Element để xác định height tham chiếu
  @Input() dataset?: Partial<{ name: string, data: any[] }>[] = [];
  @Input() xAxisCategories?: any[] = [];
  @Input() xAxisType?: 'category' | 'datetime' | 'numeric';

  chartOptions: Partial<{
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
  }> | any;

  constructor() {
  }

  ngOnInit(): void {
    this.chartOptions = {
      title: {
        text: this.chartTitle
      },
      chart: {
        type: "line",
      },
      series: this.dataset,
      xaxis: {
        categories: this.xAxisCategories
      },
      stroke: {
        width: 1
      },
      markers: {
        size: 3,
      }
    };
    if (this.height) {
      this.chartOptions.chart.height = this.height;
    } else if (this.refElementId) {
      this.height = document.getElementById(this.refElementId)?.getAttribute('height');
      if (this.height) {
        this.chartOptions.chart.height = this.height;
      }
    }
    if (this.xAxisType === undefined) this.xAxisType = 'category';
  }
}
