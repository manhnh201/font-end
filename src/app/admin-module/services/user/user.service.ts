import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DomainDetailComponent } from 'src/app/common-module/components/domain/domain-detail/domain-detail.component';
import { FormField } from 'src/app/common-module/dto/form-field.dto';
import { BaseDomainService } from 'src/app/common-module/services/base-domain/base-domain.service';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { NotificationService } from 'src/app/common-module/services/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseDomainService {
  domainName: string = "user";

  constructor(http: HttpClient, private commonService: CommonService, private notificationService: NotificationService) {
    super(http);
  }

  override analyze(item: any) {
    let _item = Object.assign({}, item);

    try {
      _item.props = _item.props === null ? {} : JSON.parse(_item.props);
    } catch (e) {
      _item.props = {};
    }
    if (item.dob) {
      _item.dob = moment(item.dob).toDate();
    }
    _item.employeePosition = _item.props.employeePosition;
    return _item;
  }

  override validate(item: any) {
    let _item = Object.assign({}, item);
    try {
      _item.props = _item.props === null ? {} : JSON.parse(_item.props);
    } catch (e) {
      _item.props = {};
    }
    _item.props.employeePosition = _item.employeePosition;
    _item.props = JSON.stringify(_item.props);
    _item.employeePosition = undefined;
    if (item.dob) {
      _item.dob = moment(item.dob).toISOString();
    }
    return _item;
  }

  downloadTemplate(item: any) {
    window.open(`${this.env.apiUrl}/api/v1/uploadFile/downloadUserTemplate`, "_blank");
  }

  upload(item: any) {
    return this.http.post<any>(`${this.env.apiUrl}/api/v1/uploadFile/uploadFile`, item);
  }

  getCurrentUser() {
    return this.http.get<any>(`${this.env.apiUrl}/api/v1/${this.domainName}/getCurrentUser`);
  }

  getCurrentUserLdapInfo() {
    return this.http.get<any>(`${this.env.apiUrl}/api/v1/${this.domainName}/getCurrentUserLdapInfo`);
  }

  getDefaultPage() {
    return this.http.get<any>(`${this.env.apiUrl}/api/v1/${this.domainName}/getDefaultPage`);
  }

  getUserWithRoles(params: any) {
    return this.http.get<any>(`${this.env.apiUrl}/api/v1/${this.domainName}/getUserWithRoles`, { params: params });
  }

  menu(params: any): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/api/v1/${this.domainName}/menu`, { params: params });
  }

  userInfo(): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/api/v1/${this.domainName}/info`);
  }

  /**
   * Hiển thị modal cho phép người dùng cập nhật thông tin user
   * @returns 
   */
  showUserProfileModal(): Observable<any> {
    return new Observable((sub) => {
      this.userInfo().subscribe({
        next: (resp) => {
          let data = resp.value;

          let __formFields: FormField[] = [
            {
              code: 'oldPassword', name: "Old Password", span: 12, type: 'password', placeholder: 'Enter password',
              required: true,
            },
            {
              code: 'newPassword', name: "New Password", span: 12, type: 'password', placeholder: 'Enter new password',
              required: false, minLength: 8,
            },
            {
              code: 'personal.fullName', name: "Fullname", span: 12, type: 'text', placeholder: 'Enter fullname',
              required: true, minLength: 3,
            },
            {
              code: 'personal.email', name: "Email", span: 12, type: 'email', placeholder: 'Enter email',
              required: false, minLength: 8,
            },
            { code: 'personal.dob', name: "DOB", span: 12, type: 'datePicker' },
            {
              code: 'personal.gender', name: "Gender", span: 12, type: 'select',
              options: [
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' }
              ],
            },
          ]

          __formFields.forEach((formField: FormField) => {
            let __value = this.commonService.getValue(data, formField.code)
            data[formField.code] = __value
          })

          this.commonService.showDetailFormModal({
            title: 'Update profile',
            refContent: DomainDetailComponent,
            width: '50%',
            formFields: __formFields,
            data: data,
            okCallback: (refContent: any, data: any) => {
              if (!refContent.validateForm.valid) {
                this.notificationService.create('warning', 'Warning', 'Plz input missing params')
                return false;
              }

              let __data = {}
              Object.keys(data).forEach((key: string) => {
                this.commonService.setValue(__data, key, data[key])
              })

              let _data = this.validate(__data);

              this.commonService.addTotalRequest()
              this.updateProfile(_data).subscribe({
                next: (value: any) => {
                  this.commonService.addCompletedRequest()
                  sub.next(value)
                }, error: (err: any) => {
                  this.commonService.addCompletedRequest()
                  sub.error(err.error)
                }
              });
              return true;
            }
          })
        }, error: (err) => {
          sub.error(err)
        }
      })
    })
  }

  /**
   * Cập nhật profile người dùng
   * @param item 
   * @returns 
   */
  updateProfile(item: any): Observable<any> {
    return this.http.put<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}/update-profile`, item);
  }
}
