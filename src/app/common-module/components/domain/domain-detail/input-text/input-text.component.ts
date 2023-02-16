import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, } from '@angular/forms';
import { FormField } from 'src/app/common-module/dto/form-field.dto';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputTextComponent
    }
  ]
})
export class InputTextComponent implements OnInit, ControlValueAccessor {
  @Input() formField!: FormField;
  @Output() onEvent = new EventEmitter();

  value: any;
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
    if (this.formField.trim === true) {
      try {
        let __value = value.trim();
        return __value;
      } catch (e) {

      }
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
