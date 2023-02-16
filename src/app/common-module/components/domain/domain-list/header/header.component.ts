import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { IAction } from 'src/app/common-module/dto/action.dto';
import { TableColumn } from 'src/app/common-module/dto/table-column';

@Component({
  selector: '[app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() cols!: TableColumn[];
  @Input() item!: any;
  @Input() hasExpand!: boolean;
  @Input() hasColumnAction!: boolean;
  @Input() columnActions!: IAction[];
  @Input() hasCheckBox!: boolean;
  @Input() checked!: boolean;
  @Input() indeterminate!: boolean;
  @Input() filterVisible!: any;
  @Input() sortPriority!: boolean;
  @Input() filterDropdownMenu!: NzDropdownMenuComponent;

  @Output() onEvent = new EventEmitter<any>();
  @Output() onCheckedChange = new EventEmitter<any>();
  @Output() onVisibleChange = new EventEmitter<any>();

  actionColumnWidth: string = "110px";

  constructor() { }

  ngOnInit(): void {
    this.actionColumnWidth = `${this.columnActions ? this.columnActions.length * (40 - 0.2 * this.columnActions.length) : 110}px`;
  }

  __onEvent(sender: string, event?: any) {
    switch (sender) {
      case 'checkedChange':
        this.onCheckedChange.emit(event);
        break;
      case 'visibleChange':
        this.onVisibleChange.emit(event);
        break;
    }
    if (!sender.startsWith('__')) {
      this.onEvent.emit({ sender: sender, event: event });
    }
  }
}
