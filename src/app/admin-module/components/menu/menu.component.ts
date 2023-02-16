import { Component, OnInit } from '@angular/core';
import { DomainBaseComponent } from 'src/app/common-module/components/domain/base/domain.component';
import { BaseDomainConfigTemplate } from 'src/app/common-module/domain/base';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { NotificationService } from 'src/app/common-module/services/notification/notification.service';
import { MenuConfigTemplate } from '../../domain/menu.dto';
import { MenuService } from '../../services/menu/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent extends DomainBaseComponent implements OnInit {
  override domainConfigTemplate: BaseDomainConfigTemplate = new MenuConfigTemplate();

  override domainService: MenuService;

  constructor(commonService: CommonService, notification: NotificationService, domainService: MenuService) {
    super(commonService, notification, domainService);
    this.domainService = domainService;
  }

  ngOnInit(): void {


    this.onInit();
  }

  override onEvent(sender: any, event?: any): void {
    super.onEvent(sender, event);
    switch (sender) {
      case 'onReloadDataTable':
        break;
    }
  }
}
