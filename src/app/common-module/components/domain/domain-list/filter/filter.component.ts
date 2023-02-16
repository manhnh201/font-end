import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IOption } from 'src/app/common-module/dto/form-field.dto';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() filterType?: string;
  @Input() searchValue!: any;
  @Input() searchOptions!: IOption[];
  @Input() colMatchMode!: string;

  @Output() onSearch = new EventEmitter<any>();
  @Output() onEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  __onEvent(sender: string, event?: any) {
    switch (sender) {
      case '__keyUp':
        if (event.event.key === 'Enter' || event.event.keyCode === 13) {
          this.onSearch.emit(event);
        }
        return;
    }
    if (!sender.startsWith('__')) {
      this.onEvent.emit({ sender: sender, event: event });
    }
  }

}
