import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { BehaviorSubject, debounceTime, Observable, startWith } from 'rxjs';
import { FormField, IOption } from 'src/app/common-module/dto/form-field.dto';
import { CacheService } from 'src/app/common-module/services/cache/cache.service';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-domain-detail',
  templateUrl: './domain-detail.component.html',
  styleUrls: ['./domain-detail.component.css']
})
export class DomainDetailComponent implements OnInit, OnDestroy {
  env = environment;

  @Input() labelWidth: 4 | 6 | 8 = 8;

  validateForm!: FormGroup;
  valueChanged: boolean = false;
  isLoading: boolean = false;

  fallback = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';

  /**
   * true: trả về form data cả các trường đánh dấu disabled=true
   */
  @Input() returnRawData: Boolean = false;

  /**
   * Danh sách các field sẽ render
   */
  @Input() formFields: FormField[] = [];

  /**
   * Dữ liệu fill vào form
   */
  @Input() data: any = {};

  /**
   * Các sự kiện trên form sẽ trả về trong callback
   */
  @Input() onEvent: (sender: any, event?: any) => void = () => { };

  @Input() editorInit: any = {}

  constructor(private fb: FormBuilder, private http: HttpClient, private cacheService: CacheService, private commonService: CommonService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.render();

    Object.keys(this.validateForm.controls).forEach((key: string) => {
      this.__modifyData(key);
    });

    let oldData: any = this.data;
    this.validateForm.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value: any) => {
        if (oldData !== value) {
          let valueChangesDetail: any = {};

          Object.keys(this.validateForm.controls).forEach((key: string) => {
            if (oldData[key] !== value[key]) {
              value[key] = this.__modifyData(key);
              valueChangesDetail[key] = { from: oldData[key], to: value[key], }
            }
          })

          if (this.onEvent !== undefined) {
            try {
              this.onEvent('valueChangesDetail', valueChangesDetail);
            } catch (e) {
              console.error(e);
            }
          }

          Object.assign(this.data, value);
          if (this.onEvent !== undefined) {
            try {
              this.onEvent('valueChanges', this.data);
            } catch (e) {
              console.error(e);
            }
          }

          this.valueChanged = true;
          oldData = value;
        }
      }
    })

    if (this.onEvent !== undefined) {
      try {
        this.onEvent('onInit');
      } catch (e) {
        console.error(e);
      }
    }
  }

  ngOnDestroy(): void {
    Object.keys(this.timeOutList).forEach((key: string) => {
      clearTimeout(this.timeOutList[key]);
    })
  }

  render() {
    if (this.data == undefined) this.data = {};
    this.formFields.forEach((item: FormField) => {
      if (this.data[item.code] === undefined) {
        this.data[item.code] = item.defaultValue;
      }
      switch (item.type) {
        case 'select':
          if (this.data[item.code] == undefined) {
            this.data[item.code] = [];
          }
          if (item.selectSource === 'api' && item.selectSourceUrl) {
            let options = this.cacheService.get(item.selectSourceUrl)
            if (options) {
              item.options = options;
              break
            }
            this.http.get(item.selectSourceUrl).subscribe({
              next: (resp: any) => {
                item.options = this.cacheService.memorize(item.selectSourceUrl ? item.selectSourceUrl : '', 60, () => {
                  if (resp instanceof Array) {
                    return resp.map((_item: any) => {
                      if (_item instanceof String) {
                        return { label: _item, value: _item };
                      } else {
                        let label;
                        if (item.selectLabelKey instanceof Array) {
                          label = item.selectLabelKey.map((key: string) => {
                            return _item[key];
                          }).join(' - ');
                        } else {
                          label = _item[item.selectLabelKey ? item.selectLabelKey : ''];
                        }
                        return { label: label, value: item.selectValueKey ? _item[item.selectValueKey] : _item };
                      }
                    })
                  }
                  let dataKey = item.selectDataKey ? item.selectDataKey : 'value';
                  if (resp[dataKey]) {
                    try {
                      resp[dataKey] = JSON.parse(resp[dataKey]);
                    } catch (e) {

                    }
                    if (resp[dataKey] instanceof Array) {
                      return resp[dataKey].map((_item: any) => {
                        if (_item instanceof String) {
                          return { label: _item, value: _item };
                        } else {
                          let label;
                          if (item.selectLabelKey instanceof Array) {
                            label = item.selectLabelKey.map((key: string) => {
                              return _item[key];
                            }).join(' - ');
                          } else {
                            label = _item[item.selectLabelKey ? item.selectLabelKey : ''];
                          }
                          return { label: label, value: item.selectValueKey ? _item[item.selectValueKey] : _item };
                        }
                      })
                    }
                  }
                })
              }
            })
          }
          break
      }
    })

    let controlConfig: any = {};
    this.formFields.forEach((item: FormField) => {
      if (item.type === 'blank') return;
      let controlCode: string = item.code ? item.code : "";
      let controlValue: any = (this.data && this.data[controlCode]) ? this.data[controlCode] : '';
      if (item.resourceType === 'json') {
        try {
          if (_.isString(controlValue)) {
            controlValue = JSON.stringify(JSON.parse(controlValue), null, 4)
          } else {
            controlValue = JSON.stringify(controlValue, null, 4)
          }
        } catch (e) {
        }
      }

      let validatorList: any[] = [];
      if (item.required) validatorList.push(Validators.required)
      if (item.pattern != undefined) {
        validatorList.push(Validators.pattern(item.pattern.toString()))
      }
      if (item.minLength !== undefined) {
        validatorList.push(Validators.minLength(item.minLength))
      }
      if (item.maxLength !== undefined) {
        validatorList.push(Validators.maxLength(item.maxLength))
      }
      if (item.type === 'email') {
        validatorList.push(Validators.email)
      }

      controlConfig[controlCode] = [{ value: controlValue, disabled: item.disabled }, validatorList]
    })
    this.validateForm = this.fb.group(controlConfig);

    this.onEvent('valueChanges', this.data);
  }

  resetForm(): void {
    this.validateForm.reset();
  }

  getData() {
    this.tryValidateForm();
    this.data = this.validateForm.getRawValue();

    this.formFields.forEach((item: FormField) => {
      if (this.returnRawData === false) {
        if (item.disabled) {
          delete this.data[item.code]
          return
        }
      }
      if (this.validateForm.value[item.code] === undefined && _.isEmpty(this.data[item.code]?.toString())) {
        delete this.data[item.code]
        return
      }

      if (item.type === 'select' && ['default', undefined].includes(item.selectMode)) {
        if (this.data[item.code] instanceof Array) {
          if (this.data[item.code].length > 0) this.data[item.code] = this.data[item.code][0]
          else this.data[item.code] = undefined;
        }
      }
      if (item.type === 'number' && this.data[item.code] === '') {
        this.data[item.code] = undefined;
      }
      if (item.type === 'switch' && this.data[item.code] === '') {
        this.data[item.code] = false;
      }
    })

    return this.data;
  }

  setData(data: any) {
    this.validateForm.patchValue(data);
  }

  setValue(controlName: string, value: any, options: any = { onlySelf: false, emitEvent: false }) {
    let control = this.validateForm.get(controlName);
    if (control === null || control === undefined) return;
    control.setValue(value, options);
  }

  setValidator(controlName: string, validatorList: any) {
    let control = this.validateForm.get(controlName);
    if (control === null || control === undefined) return;
    control.setValidators(validatorList);
    control.updateValueAndValidity({ onlySelf: false, emitEvent: false })

    let formField: FormField = this.commonService.findItem(controlName, this.formFields, 'code');
    if (formField) {
      formField.required = validatorList.includes(Validators.required);
    }
  }

  setOptions(controlName: string, options: IOption[] = []) {
    let formField: FormField = this.commonService.findItem(controlName, this.formFields, 'code');
    if (formField) {
      formField.options = options;
    }
  }

  setVisible(controlName: string, visible: boolean = true) {
    let formField: FormField = this.commonService.findItem(controlName, this.formFields, 'code');
    if (formField) {
      formField.inVisible = (visible === false);
    }
  }

  tryValidateForm() {
    Object.values(this.validateForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: false });
      }
    });
  }

  isValid() {
    return this.validateForm.valid;
  }

  __onEvent(sender: any, event: any = undefined): any {
    switch (sender) {
      case 'onSearch':
        if (event.formField.serverSearch === true) {
          this.__regTimeout(`onSearch_${event.code}`, () => {
            if (this.onEvent) this.onEvent(sender, event);
          }, 500)
        }
        return;
      default:
        break;
    }
    if (this.onEvent) {
      this.onEvent(sender, event);
    }
  }

  __modifyData(formFieldCode: string) {
    let formField: FormField = this.commonService.findItem(formFieldCode, this.formFields, 'code');
    let formControl = this.validateForm.get(formFieldCode);
    if (!formField || !formControl) return undefined;
    let value = formControl.value;

    return value
  }

  timeOutList: any = {};
  __regTimeout(code: string, callback: () => void, timeout: number) {
    clearTimeout(this.timeOutList[code]);
    this.timeOutList[code] = setTimeout(callback, timeout);
  }
}
