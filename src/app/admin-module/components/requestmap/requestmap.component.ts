import { Component, OnInit } from '@angular/core';
import { DomainBaseComponent } from 'src/app/common-module/components/domain/base/domain.component';
import { BaseDomainConfigTemplate } from 'src/app/common-module/domain/base';
import { CacheService } from 'src/app/common-module/services/cache/cache.service';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { NotificationService } from 'src/app/common-module/services/notification/notification.service';
import { RequestmapConfigTemplate } from '../../domain/requestmap.dto';
import { RequestmapService } from '../../services/requestmap/requestmap.service';
import { RoleService } from '../../services/role/role.service';

@Component({
  selector: 'app-requestmap',
  templateUrl: '../../../common-module/components/domain/base/domain.component.html',
  styleUrls: ['./requestmap.component.css']
})
export class RequestmapComponent extends DomainBaseComponent implements OnInit {
  override domainConfigTemplate: BaseDomainConfigTemplate = new RequestmapConfigTemplate();

  override domainService: RequestmapService;

  constructor(commonService: CommonService, notification: NotificationService, domainService: RequestmapService, private roleService: RoleService, private cacheService: CacheService) {
    super(commonService, notification, domainService);
    this.domainService = domainService;
  }

  ngOnInit(): void {
    let configAttributeOptions = this.cacheService.get('configAttributeOptions')
    if (configAttributeOptions !== undefined) {
      this.commonService.findItem('configAttributes', this.domainConfigTemplate.updateFormFields, 'code').options = configAttributeOptions;
      this.commonService.findItem('configAttributes', this.domainConfigTemplate.createFormFields, 'code').options = configAttributeOptions;
    } else {
      configAttributeOptions = [{ label: 'permitAll', value: 'permitAll' }, { label: 'denyAll', value: 'denyAll' }, { label: 'isAuthenticated()', value: 'isAuthenticated()' }];
      this.roleService.listV2({}, {
        next: (resp: any) => {
          resp.forEach((item: any) => {
            configAttributeOptions.push({
              label: item.authority,
              value: item.authority,
            })
          })
          this.cacheService.memorize('configAttributeOptions', 60, () => {
            return configAttributeOptions
          })
          this.commonService.findItem('configAttributes', this.domainConfigTemplate.updateFormFields, 'code').options = configAttributeOptions;
          this.commonService.findItem('configAttributes', this.domainConfigTemplate.createFormFields, 'code').options = configAttributeOptions;
        }, error: () => {
          this.commonService.findItem('configAttributes', this.domainConfigTemplate.updateFormFields, 'code').options = configAttributeOptions;
          this.commonService.findItem('configAttributes', this.domainConfigTemplate.createFormFields, 'code').options = configAttributeOptions;
        },
      })
    }

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

