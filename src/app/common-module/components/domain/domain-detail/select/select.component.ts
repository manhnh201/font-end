import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, } from '@angular/forms';
import { FormField } from 'src/app/common-module/dto/form-field.dto';
import { CommonService } from 'src/app/common-module/services/common/common.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectComponent
    }
  ]
})
export class SelectComponent implements OnInit, ControlValueAccessor {
  @Input() formField!: FormField;

  value: any;
  onChange = (value: any) => { };
  touched = false;
  onTouched = () => { };
  disabled: boolean = false;
  onValidatorChange = () => { };

  @Output() onSearch = new EventEmitter();

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  writeValue(obj: any): void {
    this.value = obj;
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

  private __modifyData(value: any[]) {
    if (this.formField.selectMode == 'tags' && this.formField.startsWith !== undefined) {
      let startsWith = this.formField.startsWith;
      let __value = this.value.map((item: string) => {
        return item.startsWith(startsWith) ? item : `${startsWith}${item}`;
      })
      return __value;
    }
    return value;
  }

  __onEvent(sender: any, event?: any): any {
    switch (sender) {
      case 'onSearch':
        if (this.formField.serverSearch === true) {
          this.commonService.regTimeout(`onSearch_${event.code}`, () => {
            this.onSearch.emit(this.value)
          }, 500)
        }
        return;
      case 'modelChange':
        this.value = this.__modifyData(event);
        this.markAsTouched();
        this.onChange(this.value);
        return;
      default:
        break;
    }
  }
}
