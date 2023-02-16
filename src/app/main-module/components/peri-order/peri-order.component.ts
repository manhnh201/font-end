import { DomainBaseComponent } from 'src/app/common-module/components/domain/base/domain.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { NotificationService } from 'src/app/common-module/services/notification/notification.service';
import { ConvertService } from 'src/app/common-module/services/convert/convert.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DomainListComponent } from 'src/app/common-module/components/domain/domain-list/domain-list.component';
import { BaseDomainConfigTemplate } from 'src/app/common-module/domain/base';
import * as moment from 'moment';
import { PeriOrderConfigTemplate } from '../../domain/peri-order';
import { PeriOrderService } from '../../services/peri-order/peri-order.service';
import { ActivatedRoute } from '@angular/router';
import { log } from 'console';
import { TableFilter } from 'src/app/common-module/dto/table-filter';

@Component({
  selector: 'app-peri-order',
  templateUrl: './peri-order.component.html',
  styleUrls: ['./peri-order.component.css']
})
export class PeriOrderComponent extends DomainBaseComponent implements OnInit {

  @ViewChild('appDomainList') appDomainList!: DomainListComponent;

  override domainConfigTemplate: BaseDomainConfigTemplate = new PeriOrderConfigTemplate();
  override domainService: PeriOrderService;

  setOfSelection: any[] = [];
  newPeriOrderFilter: TableFilter = new TableFilter();

  private sub: any;
  constructor(
    private route: ActivatedRoute,
    commonService: CommonService,
    notification: NotificationService,
    domainService: PeriOrderService,
    private convertService: ConvertService,
    private sanitizer: DomSanitizer,
    private periOrderService: PeriOrderService
  ) {
    super(commonService, notification, domainService);
    this.domainService = domainService;
  }

  ngOnInit(): void {

    // Subcribe biến periOrderFilter$ ở trong PeriOrderService
    this.periOrderService.periOrderFilter$.subscribe(data => {

      // Nhận đc data filter mới từ periOrderFilter$ thì thay đổi dữ liệu
      this.newPeriOrderFilter = data;
      this.onInit();
      this.reloadDataTable();
    })
  }

  override onEvent(sender: any, event?: any): void {
    if (sender === 'onClick') {
      sender = event.code;
      event = event.value;
    }

    switch (sender) {
      case 'onQueryParamsChange':
        break;
      case 'checkedChange':
        this.setOfSelection = event;
        return;
      case 'retry':
        // Retry lại các bản ghi có ErrCode

        // Lấy ra list các item được chọn
        let setOfSelectionItems: any[] = [];
        this.setOfSelection.forEach(id => {
          this.dataSet.forEach(item => {
            if (item.id === id) setOfSelectionItems.push(item);
          })
        })
        // Kiểm tra xem có call API hay không
        let ableRetry = false;
        setOfSelectionItems.some(item => {
          if (item.errCode !== 0) {
            ableRetry = true;
            return;
          }
        })

        if (ableRetry) {
          // Gọi API để reload các bản ghi ở đây
          const date = new Date();
          const transtime = moment(date).unix();
          const aipkey = "APIKEY:UGVyaUJ1eWluZ09yZGVyQFNBUyNLQlNW"
          let token = this.domainService.generateToken(aipkey, transtime);
          let data = JSON.stringify({ listID: this.setOfSelection });
          this.domainService.retry(transtime, token, data).subscribe({
            next: (res: any) => {
              if (res.code === 0) {
                this.notification.create('success', 'Đã Retry thành công!', res.message)
              } else {
                this.notification.create('error', 'Có lỗi!', res.message)
              }
            }
          });
          this.appDomainList.clearSetOfSelection();
          this.reloadDataTable();
        } else {
          //Báo lỗi nếu có bản ghi không phù hợp
          this.notification.create('error', 'Giao dịch không có lỗi không thể Retry', 'Vui lòng thử lại!')
        }

        break;
    }

    super.onEvent(sender, event);
  }

  override reloadDataTable(): void {
    this.loading = true;

    //Hàm gọi API
    this.domainService.loadDataTable(this.newPeriOrderFilter).subscribe({
      next: (data: any) => {
        this.onEvent('onReloadDataTable', data);
        this.loading = false;
        this.totalRows = data.totalRows;
        this.dataSet = data.items.map((item: any) => {
          item = this.domainService.analyze(item);

          item.excDate = `<span>${moment(item.excDate).format(
            'DD/MM/YYYY'
          )}</span><br>`;

          let _price = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(item.price);
          item.price = this.sanitizer.bypassSecurityTrustHtml(_price);

          let _value = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(item.value);
          item.value = this.sanitizer.bypassSecurityTrustHtml(_value);

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
