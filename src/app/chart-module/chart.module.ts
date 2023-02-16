import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { CommonChartComponent } from './components/common-chart/common-chart.component';

// https://apexcharts.com/docs/angular-charts/
// npm install apexcharts ng-apexcharts --save

@NgModule({
  declarations: [
    LineChartComponent,
    CommonChartComponent
  ],
  imports: [
    CommonModule,

    NgApexchartsModule,
  ],
  exports: [
    NgApexchartsModule,
    LineChartComponent,
    CommonChartComponent
  ]
})
export class ChartModule { }
