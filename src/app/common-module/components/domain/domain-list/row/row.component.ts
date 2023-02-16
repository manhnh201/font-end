import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { IAction } from 'src/app/common-module/dto/action.dto';
import { TableColumn } from 'src/app/common-module/dto/table-column';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { RenderTemplateService } from 'src/app/common-module/services/render-template/render-template.service';

@Component({
  selector: '[app-row]',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css']
})
export class RowComponent implements OnInit {
  @Input() cols!: TableColumn[];
  @Input() item!: any;
  @Input() hasExpand!: boolean;
  @Input() hasColumnAction!: boolean;
  @Input() columnActions!: IAction[];
  @Input() hasCheckBox!: boolean;
  @Input() checked!: boolean;

  @Output() onEvent = new EventEmitter<any>();
  @Output() onExpandChange = new EventEmitter<any>();
  @Output() onCheckedChange = new EventEmitter<any>();
  @Output() onCellClick = new EventEmitter<any>();
  @Output() onMouseOver = new EventEmitter<any>();

  size: NzButtonSize = 'small';
  colData: any = {};

  constructor(private commonService: CommonService, public renderTemplateService: RenderTemplateService) { }

  ngOnInit(): void {
  }

  __onEvent(sender: string, event?: any) {
    switch (sender) {
      case 'expandChange':
        this.onExpandChange.emit(event);
        break;
      case 'checkedChange':
        this.onCheckedChange.emit(event);
        break;
      case 'cellClick':
        this.onCellClick.emit(event);
        break;
      case 'mouseover':
        this.onMouseOver.emit(event);
        break;
    }
    if (!sender.startsWith('__')) {
      this.onEvent.emit({ sender: sender, event: event });
    }
  }
}
