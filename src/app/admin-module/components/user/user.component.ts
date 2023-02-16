import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { DomainBaseComponent } from 'src/app/common-module/components/domain/base/domain.component';
import { BaseDomainConfigTemplate } from 'src/app/common-module/domain/base';
import { FormField } from 'src/app/common-module/dto/form-field.dto';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { NotificationService } from 'src/app/common-module/services/notification/notification.service';
import { UserConfigTemplate } from '../../domain/user.dto';
import { RoleService } from '../../services/role/role.service';
import { UserService } from '../../services/user/user.service';

/**
 * Kế thừa: 
 * + templateUrl: '../../../common-module/components/domain/base/domain.component.html',
 */

@Component({
  selector: 'app-user',
  templateUrl: '../../../common-module/components/domain/base/domain.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent extends DomainBaseComponent implements OnInit {
  override domainConfigTemplate: BaseDomainConfigTemplate = new UserConfigTemplate();

  roleOptions: any[] = [];

  constructor(commonService: CommonService, notification: NotificationService, domainService: UserService, private roleService: RoleService) {
    super(commonService, notification, domainService);
  }

  ngOnInit(): void {
    this.roleOptions = [];
    this.roleService.list().subscribe({
      next: (value: any[]) => {
        value.forEach((item: any) => {
          this.roleOptions.push({
            label: item.authority,
            value: item
          })
        })
        let field: FormField | undefined =  this.commonService.findItem('roles', this.domainConfigTemplate.updateFormFields, 'code');
        if (field) {
          field.options = this.roleOptions;
        }
        field = this.commonService.findItem('roles', this.domainConfigTemplate.createFormFields, 'code');
        if (field) {
          field.options = this.roleOptions;
        }
      }
    })

    this.onInit();
  }

  override onEvent(sender: any, event?: any): void {
    super.onEvent(sender, event);
    switch (sender) {
      case 'onReloadDataTable':
        break;
      case 'onGetDataById':
        let _roles: any[] = [];
        event.roles.forEach((role: any) => {
          let _role = this.roleOptions.find((item) => { return item.value.id === role.id; })
          if (_role) _roles.push(_role.value);
        })
        event.roles = _roles;
        break;
    }
  }

  override formDataToObject(data: any) {
      let __data = {}
      Object.keys(data).forEach((key: string) => {
        this.commonService.setValue(__data, key, data[key])
      })
      return __data
  }

  override objectToFormData(data: any) {
    this.domainConfigTemplate.updateFormFields.forEach((formField: FormField) => {
      let __value = this.commonService.getValue(data, formField.code)
      data[formField.code] = __value
    })
    return data
  }
}
