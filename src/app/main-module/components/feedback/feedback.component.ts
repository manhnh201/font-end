import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { DomainBaseComponent } from 'src/app/common-module/components/domain/base/domain.component';
import { DomainListComponent } from 'src/app/common-module/components/domain/domain-list/domain-list.component';
import { BaseDomainConfigTemplate } from 'src/app/common-module/domain/base';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { ConvertService } from 'src/app/common-module/services/convert/convert.service';
import { NotificationService } from 'src/app/common-module/services/notification/notification.service';
import { FeedbackConfigTemplate } from '../../domain/feedback';
import { FeedbackService } from '../../services/feedback/feedback.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent extends DomainBaseComponent implements OnInit {
  @ViewChild('appDomainList') appDomainList!: DomainListComponent;

  override domainConfigTemplate: BaseDomainConfigTemplate =
    new FeedbackConfigTemplate();
  override domainService: FeedbackService;

  dataExport: any[] = [];

  constructor(
    commonService: CommonService,
    notification: NotificationService,
    domainService: FeedbackService,
    private convertService: ConvertService,
    private sanitizer: DomSanitizer
  ) {
    super(commonService, notification, domainService);
    this.domainService = domainService;
  }

  ngOnInit(): void {
    this.onInit();
  }

  override reloadDataTable(): void {
    this.loading = true;

    this.domainService
      .loadDataTable(
        this.convertService.tableFilter2MongoQuery(this.tableFilter)
      )
      .subscribe({
        next: (data: any) => {
          this.onEvent('onReloadDataTable', data);
          this.loading = false;
          this.totalRows = data.total;
          this.dataSet = data.data.map((item: any) => {
            item = this.domainService.analyze(item);

            item.createdDate = `<span>${moment(item.createdDate).format(
              'DD/MM/YYYY'
            )}</span><br>`;
            item.type = this.capitalizeFirstLetter(item.type);
            item.status = this.capitalizeFirstLetter(item.status);

            return item;
          });

          this.onEvent('postReloadDataTable');
        },
        error: (err: any) => {
          this.notification.create('error', 'Error', err.error);
          this.loading = false;
          this.totalRows = 0;
        },
        complete: () => {},
      });
  }

  override onEvent(sender: any, event?: any): void {
    if (sender === 'onClick') {
      sender = event.code;
      event = event.value;
    }

    switch (sender) {
      //Xử lý sự kiện export
      case 'export':
        // Lấy filter export
        this.domainService
          .loadDataTable(
            this.convertService.tableFilter2MongoQuery({
              ...this.tableFilter,
              rows: 100000,
            })
          )
          .subscribe({
            next: (data: any) => {
              this.dataExport = data.data.map((item: any) => {
                item.createdDate = moment(item.createdDate).format('DD/MM/YYYY');
                item.type = this.capitalizeFirstLetter(item.type);
                item.status = this.capitalizeFirstLetter(item.status);

                return item;
              });
            },
            error: (err: any) => {
              this.notification.create('error', 'Error', err.error);
              this.loading = false;
              this.totalRows = 0;
            },
            complete: () => {
              const data = this.dataExport.map((data, index) =>({
                'STT' : index +1,
                'CusID' : data.cusId,
                'Type' : data.type,
                'Content' : data.content,
                'Created Date' : data.createdDate,
                'Status' : data.status
              }))
              const ws = XLSX.utils.json_to_sheet(data);
              /* generate workbook and add the worksheet */
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

              /* save to file */
              XLSX.writeFile(wb, 'Feedback.xlsx');
            },
          });

        break;
    }

    super.onEvent(sender, event);
  }

  capitalizeFirstLetter(string: string | undefined) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return;
  }
}
