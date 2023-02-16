import { Component, OnInit } from '@angular/core';
import { DomainBaseComponent } from 'src/app/common-module/components/domain/base/domain.component';
import { BaseDomainConfigTemplate } from 'src/app/common-module/domain/base';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { NotificationService } from 'src/app/common-module/services/notification/notification.service';
import { ConfConfigTemplate } from '../../domain/conf';
import { ConfService } from '../../services/conf/conf.service';

@Component({
  selector: 'app-conf',
  templateUrl: '../../../common-module/components/domain/base/domain.component.html',
  styleUrls: ['./conf.component.css']
})
export class ConfComponent extends DomainBaseComponent implements OnInit {
  override domainConfigTemplate: BaseDomainConfigTemplate = new ConfConfigTemplate();

  constructor(commonService: CommonService, notification: NotificationService, domainService: ConfService) {
    super(commonService, notification, domainService);
    this.domainConfigTemplate.detailModalWidth = "50%";
  }

  ngOnInit(): void {
    this.onInit();
  }

  override onEvent(sender: any, event?: any): void {
    super.onEvent(sender, event);
  }
}