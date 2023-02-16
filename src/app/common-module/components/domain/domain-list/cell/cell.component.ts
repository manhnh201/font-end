import { Component, Input, OnInit } from '@angular/core';
import { TableColumn } from 'src/app/common-module/dto/table-column';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { RenderTemplateService } from 'src/app/common-module/services/render-template/render-template.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  @Input() col!: TableColumn;
  @Input() item!: any;

  colData: any = {};

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    let __val = this.commonService.getValue(this.item, this.col.code);
    if (this.col.tag === 'json') {
      try {
        __val = JSON.parse(__val);
      } catch (e) {
        __val = 'json err...'
      }
    } else if (this.col.tag === 'number') {
      try {
        __val = parseFloat(__val.toString()).toLocaleString()
      } catch (e) {
      }
    } else if (this.col.maxLength && __val && __val.length > this.col.maxLength) {
      let _charCount = this.col.maxLength / 2
      __val = __val.substring(0, _charCount) + '...' + __val.substring(__val.length - _charCount, __val.length)
    }
    this.colData[this.col.code] = __val;
  }

}
