import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormField } from 'src/app/common-module/dto/form-field.dto';

@Component({
  selector: 'app-json',
  templateUrl: './json.component.html',
  styleUrls: ['./json.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: JsonComponent
    }
  ]
})
export class JsonComponent implements OnInit, ControlValueAccessor {
  @Input() formField!: FormField;
  @Output() onEvent = new EventEmitter();

  value: any;
  obj: any;
  onChange = (value: any) => { };
  touched = false;
  onTouched = () => { };
  disabled: boolean = false;

  constructor() { }

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
    this.__modifyData(this.value);
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

  private __modifyData(value: any) {
    try {
      this.obj = JSON.parse(value);
      this.value = JSON.stringify(this.obj, null, '   ');
      console.log(this.value);
    } catch (e) {
      this.obj = undefined;
    }
    return value;
  }

  __onEvent(sender: any, event?: any): any {
    switch (sender) {
      case 'modelChange':
        this.value = this.__modifyData(event);
        this.markAsTouched();
        this.onChange(this.value);
        return;
      default:
        break;
    }
    this.onEvent.emit({ sender: sender, event: sender });
  }
}
