import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexYAxis, ApexDataLabels, ApexPlotOptions, ApexStroke, ApexGrid, ApexMarkers } from 'ng-apexcharts';

@Component({
  selector: 'app-common-chart',
  templateUrl: './common-chart.component.html',
  styleUrls: ['./common-chart.component.css']
})
export class CommonChartComponent implements OnInit, OnChanges {
  @Input() chartTitle!: string;
  @Input() chartType: 'line' | 'bar' = 'line';
  @Input() dataset!: any[];

  @Input() zoomEnabled: boolean = false;

  /**
   * Chiều cao của đồ thị
   */
  @Input() height?: number | string | null;
  /**
   * Element để xác định height tham chiếu
   */
  @Input() refElementId?: string;

  /**
   * Trường dữ liệu cần lấy trong dataset để làm trục x
   */
  @Input() xAxisKey!: string;
  @Input() xAxisType: 'category' | 'datetime' | 'numeric' = 'category';
  @Input() xAxisLabel?: string;

  /**
   * Danh sách các trường cần lấy dữ liệu trong dataset để vẽ đồ thị
   * Trường hợp mảng rỗng hoặc không chỉ định, tự động xác định theo dataset
   */
  @Input() seriesKeys!: string[];
  @Input() yAxisLabel?: string;

  /**
   * Danh sách các trường cần lấy dữ liệu trong dataset để vẽ đồ thị dùng cột Y bên phải
   */
  @Input() yAxisRightKeys!: string[];
  @Input() yAxisRightLabel?: string;

  /**
   * Giá trị mặc định của đồ thị khi giá trị trong dataset là undefined
   */
  @Input() defaultValue = NaN;

  /**
   * Có hiển thị lable trên đồ thị không
   */
  @Input() dataLabelEnabled: boolean = false;

  @Output() onEvent = new EventEmitter()

  __dataset: Partial<{ name: string, data: any[] }>[] = [];
  private __title!: ApexTitleSubtitle;
  private __chart!: ApexChart;
  private __xAxisCategories: any[] = [];
  private __xAxis!: ApexXAxis | ApexXAxis[];
  private __yAxis!: ApexYAxis | ApexYAxis[];
  private __dataLabels!: ApexDataLabels;

  private __defaultOptions: CommonChartOptions = {
    stroke: {
      curve: 'smooth',
      width: 1
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    markers: {
      size: 3,
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        dataLabels: {
          position: 'top',
        },
      }
    }
  }

  chartOptions: CommonChartOptions | any;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataset === undefined || this.dataset.length === 0) {
      return;
    }

    this.__modifyData()
    this.__configTitle()
    this.__configChart()
    this.__configDataLabels()
    this.__configXAxis()
    this.__configYAxis()

    this.chartOptions = {
      ...this.__defaultOptions,
      title: this.__title,
      chart: this.__chart,
      dataLabels: this.__dataLabels,
      series: this.__dataset,
      xaxis: this.__xAxis,
      yaxis: this.__yAxis,
    };

    if (this.height) {
      this.chartOptions.chart.height = this.height;
    } else if (this.refElementId) {
      this.height = document.getElementById(this.refElementId)?.getAttribute('height');
      if (this.height) {
        this.chartOptions.chart.height = this.height;
      }
    }
  }

  ngOnInit(): void {
  }

  ___onEvent(sender: any, event?: any) {
    this.onEvent.emit({ sender: sender, event: event });
  }

  private __modifyData() {
    this.__xAxisCategories = []
    this.dataset.forEach((item) => {
      this.__xAxisCategories?.push(item[this.xAxisKey])
    })
    this.__dataset = []

    if (this.seriesKeys === undefined || this.seriesKeys.length === 0) {
      let __keys: string[] = []
      this.dataset.forEach((item: any) => {
        Object.keys(item).forEach((key) => {
          if (key === this.xAxisKey || __keys.includes(key)) return
          __keys.push(key)
        })
      })
      this.seriesKeys = __keys
    }

    this.seriesKeys.forEach((key: string) => {
      this.__dataset.push({
        name: key,
        data: this.dataset.map((item) => { return item[key] || this.defaultValue })
      })
    })
  }

  private __configTitle() {
    this.__title = {
      text: this.chartTitle,
      align: 'center',
      style: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
      }
    }
  }

  private __configChart() {
    this.__chart = {
      type: this.chartType,
      zoom: {
        enabled: this.zoomEnabled
      },
      events: {
        dataPointSelection: (event: MouseEvent, chartContext: any, config: any) => {
          this.___onEvent(CommonChartEventEnum.dataPointSelection, {
            categoriesIndex: config.dataPointIndex,
            seriesIndex: config.seriesIndex,
            categories: this.__xAxisCategories,
            series: this.__dataset
          })
        },
        markerClick: (event: MouseEvent, chartContext: any, config: any) => {
          this.___onEvent(CommonChartEventEnum.markerClick, {
            categoriesIndex: config.dataPointIndex,
            seriesIndex: config.seriesIndex,
            categories: this.__xAxisCategories,
            series: this.__dataset
          })
        }
      },
    }
  }

  private __configXAxis() {
    this.__xAxis = {
      type: this.xAxisType,
      categories: this.__xAxisCategories,
      axisTicks: {
        show: true
      },
      axisBorder: {
        show: true,
      },
      title: {
        text: this.xAxisLabel
      },
      labels: {
        datetimeUTC: false
      }
    }
  }

  private __configYAxis() {
    let __defaultConfig = {
      axisTicks: {
        show: true
      },
      axisBorder: {
        show: true,
      },
    }

    if (this.yAxisRightKeys !== undefined && this.yAxisRightKeys.length > 0) {
      this.__yAxis = [{
        ...__defaultConfig,
        title: {
          text: this.yAxisLabel
        }
      }, {
        opposite: true,
        ...__defaultConfig,
        title: {
          text: this.yAxisRightLabel
        }
      }]
    } else {
      this.__yAxis = {
        ...__defaultConfig,
        axisTicks: {
          show: true
        },
        title: {
          text: this.yAxisLabel
        }
      }
    }
  }

  private __configDataLabels() {
    this.__dataLabels = {
      enabled: this.dataLabelEnabled,
      formatter: function (val) {
        return val + "";
      },
      offsetY: this.chartType === 'bar' ? -15 : 0,
      style: {
        fontSize: '9px',
        colors: ["#304758"]
      }
    }
  }
}


export type CommonChartOptions = {
  markers?: ApexMarkers
  grid?: ApexGrid
  stroke?: ApexStroke
  series?: ApexAxisChartSeries
  chart?: ApexChart
  xaxis?: ApexXAxis
  plotOptions?: ApexPlotOptions
  title?: ApexTitleSubtitle
  dataLabels?: ApexDataLabels
}

export enum CommonChartEventEnum {
  dataPointSelection = 'dataPointSelection',
  markerClick = 'markerClick'
}
