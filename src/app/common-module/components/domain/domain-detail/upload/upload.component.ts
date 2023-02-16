import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { FormField } from 'src/app/common-module/dto/form-field.dto';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: UploadComponent
    }
  ]
})
export class UploadComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() formField!: FormField;

  uuid = uuidv4().toLocaleLowerCase();

  value: any[] = [];
  onChange = (value: any) => { };
  touched = false;
  onTouched = () => { };
  disabled: boolean = false;
  onValidatorChange = () => { };

  oldFileCount = 0;

  @Output() onSearch = new EventEmitter();

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.commonService.regInterval(this.uuid, () => {
      if (this.value.length != this.oldFileCount) {
        this.oldFileCount = this.value.length;
        this.onChange(this.value);
      }
    }, 100)
  }

  ngOnDestroy(): void {
    this.commonService.clearInterval(this.uuid);
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  writeValue(obj: any): void {
    if (obj === undefined || obj === null || obj === '' || obj === 'undefined' || obj === 'null'|| obj.startsWith('data') ) {
      this.value = [];
      return;
    }
    if (obj instanceof Array) this.value = obj;
    else if (obj instanceof File) this.value = [obj];
    else {
      let _fileParts = obj.split('/');
      this.value = [{
        uid: uuidv4().toLocaleLowerCase(),
        name: _fileParts[_fileParts.length - 1],
        status: 'done',
        url: obj
      }];
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  __beforeUpload = (file: NzUploadFile): boolean | Observable<any> => {
    if (this.formField.uploadMultiple == true) {
      this.value = this.value.concat(file);
    } else {
      this.value = [file];
    }

    this.oldFileCount = this.value.length;
    this.onChange(this.value);

    return false;
  };
}