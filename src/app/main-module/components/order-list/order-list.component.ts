import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { log } from 'console';
import * as moment from 'moment';
import { DomainBaseComponent } from 'src/app/common-module/components/domain/base/domain.component';
import { DomainListComponent } from 'src/app/common-module/components/domain/domain-list/domain-list.component';
import { BaseDomainConfigTemplate } from 'src/app/common-module/domain/base';
import { Filter, TableFilter } from 'src/app/common-module/dto/table-filter';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { ConvertService } from 'src/app/common-module/services/convert/convert.service';
import { NotificationService } from 'src/app/common-module/services/notification/notification.service';
import { OrderListConfigTemplate } from '../../domain/order-list.dto';
import { OrderListService as OrderListService } from '../../services/order-list/order-list.service';
import { PeriOrderService } from '../../services/peri-order/peri-order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent extends DomainBaseComponent implements OnInit {

  @ViewChild('appDomainList') appDomainList!: DomainListComponent;

  override domainConfigTemplate: BaseDomainConfigTemplate = new OrderListConfigTemplate();
  override domainService: OrderListService;

  setOfSelection: any[] = [];

  constructor(
    private router: Router,
    commonService: CommonService,
    notification: NotificationService,
    domainService: OrderListService,
    private convertService: ConvertService,
    private sanitizer: DomSanitizer,
    private periOrderService: PeriOrderService
  ) {
    super(commonService, notification, domainService);
    this.domainService = domainService;
  }

  ngOnInit(): void {
    this.onInit();
  }

  override onEvent(sender: any, event?: any): void {
    switch (sender) {
      case 'onClick':
        switch (event.code) {
          case 'detail':
            // alert('mở page Order Detail, lọc mặc định theo peri order id = id của record được chọn')
            this.router.navigate(['/main/peri-order-detail']);
            return
        }
        break;
      case 'onCellClick':
        switch (event.code) {
          case 'custodycd':
            let custodycdValue = event.value.custodycd.replace(/<\/?[^>]+(>|$)/g, "") //Remove <a></a> from the custodycd

            // Create new filter
            let newFilter: TableFilter = {
              ...this.tableFilter,
              filters: {
                "custodycd": {
                  "matchMode": "equals",
                  "value": `${custodycdValue}`
                }
              }
            }

            //Emit value mới cho Subject đã khai báo trong PeriOrderService tới các subcriber
            this.periOrderService.periOrderFilter.next(newFilter)

            // alert('mở page Order Detail, lọc mặc định theo custodycd = custodycd của record được chọn')
            this.router.navigate(['/main/peri-order-detail']);

            return
        }
    }
    super.onEvent(sender, event)
  }

  override reloadDataTable(): void {
    this.loading = true;

    //Hàm gọi API
    this.domainService.loadDataTable(this.tableFilter).subscribe({
      next: (data: any) => {


        this.onEvent('onReloadDataTable', data);
        this.loading = false;
        this.totalRows = data.totalRows;
        this.dataSet = data.items.map((item: any) => {
          item = this.domainService.analyze(item);

          item.custodycd = `<a>${item.custodycd}</a>`

          item.orderDate = `<span>${moment(item.orderDate).format("DD/MM/YYYY")}</span><br>`;
          item.startDate = `<span>${moment(item.startDate).format("DD/MM/YYYY")}</span><br>`;
          item.endDate = `<span>${moment(item.endDate).format("DD/MM/YYYY")}</span><br>`;
          item.scheduleDate = `<span>${moment(item.scheduleDate).format("DD/MM/YYYY")}</span><br>`;
          item.createdAt = `<span>${moment(item.createdAt).format("DD/MM/YYYY")}</span><br>`;
          item.updatedAt = `<span>${moment(item.updatedAt).format("YYYY/MM/DD")}</span><br>`;

          let buyingValue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(item.buyingValue);
          item.buyingValue = this.sanitizer.bypassSecurityTrustHtml(buyingValue);

          return item;
        });

        this.onEvent('postReloadDataTable');
      },
      error: (err: any) => {
        this.notification.create('error', 'Error', err.error);
        this.loading = false;
        this.totalRows = 0;
      },
      complete: () => { },
    });
  }

}
