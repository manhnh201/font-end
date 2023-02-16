import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, Type, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NzTableComponent, NzTableLayout, NzTableQueryParams } from 'ng-zorro-antd/table';
import { RowExpandDirective } from 'src/app/common-module/directives/row-expand/row-expand.directive';
import { IAction } from 'src/app/common-module/dto/action.dto';
import { IOption } from 'src/app/common-module/dto/form-field.dto';
import { TableColumn } from 'src/app/common-module/dto/table-column';
import { Filter, TableFilter } from 'src/app/common-module/dto/table-filter';
import { CacheService } from 'src/app/common-module/services/cache/cache.service';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop'
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import * as uuid from 'uuid'
import { ConvertService } from 'src/app/common-module/services/convert/convert.service';


@Component({
  selector: 'app-domain-list',
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.css']
})
export class DomainListComponent implements OnInit, OnDestroy, OnChanges {
  private uuid: string = uuid.v4().toString()

  checked: boolean = false;
  indeterminate: boolean = false;

  size: any = "small";

  /**
   * fetch and present data from remote server
   */
  @Input() ajax: boolean = true;

  /**
   * Textbox Quick Search
   */
  @Input() quickSearchAllow: boolean = false;
  @Input() quickSearchValue: string = '';
  @Output() quickSearchValueChange = new EventEmitter();
  @Input() quickSearchPlaceholder: string = 'input search text';
  @Input() loading: boolean = true;
  @Input() hasColumnAction: boolean = false;
  @Input() columnActions: IAction[] = [];
  @Input() hasAction: boolean = false;
  @Input() actions: IAction[] = [];
  @Input() hasCheckBox: boolean = false;

  @Input() fixHeader: boolean = false;
  @Input() tableHeight: string = '240px';

  /**
   * Cho phép hiển thị Context Menu
   */
  @Input() hasContextMenu: boolean = true;
  /**
   * Context Menu mặc định sẽ hiển thị
   * Trường hợp hasContextMenu == true && mảng rỗng thì lấy từ columnActions
   */
  @Input() rowContextMenuActions: IAction[] = [];

  /**
   * Giá trị để map row với setOfSelection
   * Bắt buộc chỉ định nếu hasCheckBox == true
   */
  @Input() checkedKey: string = 'id';
  @Output() setOfSelection: Set<any> = new Set<any>();
  @Input() dataSet: any[] = [];
  @Input() cols: TableColumn[] = [];
  @Input() tableFilter: TableFilter = new TableFilter();
  @Output() tableFilterChange = new EventEmitter();
  @Input() totalRows!: number;
  @Output() onQueryParamsChange = new EventEmitter();

  /**
   * Sự kiện thao tác trên bảng
   * Hỗ trợ
   * + expandChange: Người dùng click nút Expand Row
   * + onDrop: Người dùng thực hiện thao tác kéo thả Row
   * + onQueryParamsChange: Người dùng thực hiện filter dữ liệu
   */
  @Output() onEvent = new EventEmitter();

  /**
   * Cho phép drag hay không
   */
  @Input() dragDisabled: boolean = true;

  /**
   * Cho phép expand row hay không
   */
  @Input() hasExpand: boolean = false;
  @Input() expandMultiRow: boolean = false;
  @Input() expandRowComponent!: any;
  @ViewChildren(RowExpandDirective, { read: ViewContainerRef }) container!: QueryList<ViewContainerRef>;

  multipleSort: boolean = false;
  filterVisible: any = {};
  searchValue: any;
  searchOptions: IOption[] = [];
  filterType?: 'datePicker' | 'dateRangePicker' | 'text';
  colMatchMode: string = 'equals';
  rawQueryParams?: NzTableQueryParams;
  actionColumnWidth: string = "110px";

  __scroll: { x?: 'auto' | string, y?: 'auto' | string } = {};
  __tableLayout: NzTableLayout = 'auto';

  DomainListSenderEnum = DomainListSenderEnum;

  constructor(private commonService: CommonService, private convertService: ConvertService, private cacheService: CacheService, private http: HttpClient, private nzContextMenuService: NzContextMenuService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  ngOnDestroy(): void {
  }

  render() {
    let widthRegex = /width: ([\w-]+);{0,1}/g
    this.cols.forEach((col: TableColumn) => {
      if (col.headerStyle) {
        let matches = [...col.headerStyle.matchAll(widthRegex)]
        if (matches.length > 0) {
          col.width = matches[0][1];
          col.headerStyle = col.headerStyle.replace(widthRegex, '')
        }
      }

      switch (col.filterType) {
        case 'select':
          if (col.selectSource === 'api' && col.selectSourceUrl) {
            let options = this.cacheService.get(col.selectSourceUrl)
            if (options) {
              col.searchOptions = options;
              break
            }
            this.http.get(col.selectSourceUrl).subscribe({
              next: (resp: any) => {
                col.searchOptions = this.cacheService.memorize(col.selectSourceUrl ? col.selectSourceUrl : '', 60, () => {
                  if (resp instanceof Array) {
                    return resp.map((_item: any) => {
                      if (_item instanceof String) {
                        return { label: _item, value: _item };
                      } else {
                        let label;
                        if (col.selectLabelKey instanceof Array) {
                          label = col.selectLabelKey.map((key: string) => {
                            return _item[key];
                          }).join(' - ');
                        } else {
                          label = _item[col.selectLabelKey ? col.selectLabelKey : ''];
                        }
                        return { label: label, value: col.selectValueKey ? _item[col.selectValueKey] : _item };
                      }
                    })
                  }
                  let dataKey = col.selectDataKey ? col.selectDataKey : 'value';
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
                          if (col.selectLabelKey instanceof Array) {
                            label = col.selectLabelKey.map((key: string) => {
                              return _item[key];
                            }).join(' - ');
                          } else {
                            label = _item[col.selectLabelKey ? col.selectLabelKey : ''];
                          }
                          return { label: label, value: col.selectValueKey ? _item[col.selectValueKey] : _item };
                        }
                      })
                    }
                  }
                })
                col.searchOptions = col.searchOptions?.sort((a: IOption, b: IOption) => {
                  return a.label < b.label ? -1 : 1
                })
              }
            })
          }
          break
      }

      if (_.isEmpty(this.rowContextMenuActions)) this.rowContextMenuActions = this.columnActions;
    })

    if (this.fixHeader) {
      this.__scroll.y = this.tableHeight;
    }

    if (this.cols.filter((col: TableColumn) => { return col.width !== undefined }).length === this.cols.length) {
      this.__scroll.x = 'auto'
    }

    this.actionColumnWidth = `${this.columnActions ? this.columnActions.length * (40 - 0.2 * this.columnActions.length) : 110}px`;

    this.columnActions.forEach((action: any) => {
      action.onEvent = (sender: any, event: any) => {
        this.__onEvent(sender, event);
      }
    })

    this.actions.forEach((action: any) => {
      action.onEvent = (sender: any, event: any) => {
        this.__onEvent(sender, event);
      }
    })
  }

  __lastRawQuery: any = {};
  __selectedItem: any = undefined;
  __onEvent(sender?: DomainListSenderEnum | string, event?: any) {
    //postHandle event
    switch (sender) {
      case DomainListSenderEnum.__checkedChange:
        this.setOfSelection.delete(event.item[this.checkedKey]);
        if (event.value === true) {
          this.setOfSelection.add(event.item[this.checkedKey]);
        }
        this.__onEvent(DomainListSenderEnum.checkedChange, Array.from(this.setOfSelection.values()));
        break;
      case DomainListSenderEnum.__checkedAllChange:
        this.setOfSelection.clear();
        if (event === true) {
          this.dataSet.forEach((item: any) => {
            this.setOfSelection.add(item[this.checkedKey]);
          })
        }
        this.__onEvent(DomainListSenderEnum.checkedChange, Array.from(this.setOfSelection.values()));
        break;
      case DomainListSenderEnum.expandChange:
        let __viewContainerRef: any
        if (!this.expandMultiRow) {
          this.dataSet.forEach((item: any) => {
            if (item['_idx'] === event.item['_idx']) return;
            __viewContainerRef = this.container.get(item['_idx']);
            __viewContainerRef?.clear();
            item.expand = false;
          })
        }

        if (event.value === true) {
          __viewContainerRef = this.container.get(event.item['_idx']);
          if (!this.expandRowComponent) {
            event.viewContainerRef = __viewContainerRef
            break;
          };
          let __componentRef: any = __viewContainerRef?.createComponent(this.expandRowComponent);
          if (__componentRef) __componentRef.instance.data = event.item;
        } else {
          __viewContainerRef = this.container.get(event.item['_idx']);
          __viewContainerRef?.clear();
        }
        break;
      case DomainListSenderEnum.currentPageDataChange:
        return;
      case DomainListSenderEnum.onQueryParamsChange:
        if (!this.ajax) return
        if (this.rawQueryParams) {
          event.filter = this.rawQueryParams.filter;
        }
        this.rawQueryParams = event;
        let rs = _.isEqual(this.rawQueryParams, this.__lastRawQuery)
        if (rs) {
          return;
        }
        this.__lastRawQuery = _.cloneDeep(this.rawQueryParams);

        let __queryParams = JSON.parse(JSON.stringify(event));

        if (__queryParams.filter) {
          __queryParams.filter.forEach((item: any) => {
            let col: TableColumn = this.commonService.findItem(item.key, this.cols, 'code');
            if (col && col.searchCode) {
              item.key = col.searchCode;
            }
          })
        }

        event = this.convertService.convertAntFilterToTableFilter(__queryParams);
        break
      case DomainListSenderEnum.nzVisibleChange:
        if (!event.value) break;
        let col: any = this.cols.find((item: any) => {
          return item.code === event.code
        })
        this.searchValue = col['searchValue'];
        this.searchOptions = col['searchOptions'];
        this.filterType = col['filterType'];
        this.colMatchMode = col['matchMode'];
        return;
      case DomainListSenderEnum.search:
        Object.keys(this.filterVisible).forEach((key: string) => {
          if (this.filterVisible[key] == true) {
            this.filterVisible[key] = false;

            let col: TableColumn | undefined = this.cols.find((item: any) => {
              return item.code === key
            })
            if (!col) return;
            col['searchValue'] = event;
            this.searchValue = undefined;

            if (this.rawQueryParams === undefined) return;
            if (this.rawQueryParams.filter === undefined) {
              this.rawQueryParams.filter = [];
            }
            let filterParam = this.commonService.findItem(key, this.rawQueryParams.filter, 'key')

            if (col.filterModifyTime === true) {
              if (col.filterType === 'datePicker' && col.dataType === 'datetime') {
                col.searchValue = moment(col.searchValue).endOf('day').toDate()
              } else if (col.filterType === 'dateRangePicker' && col.dataType === 'datetime') {
                col.searchValue = [moment(col.searchValue[0]).startOf('day').toDate(), moment(col.searchValue[1]).endOf('day').toDate()]
              }
            }

            if (filterParam) {
              filterParam.value = col['searchValue'];
              filterParam.matchMode = col['matchMode'] || 'equals';
              filterParam.dataType = col['dataType'];
              filterParam.order = col['filterOrder'];
            } else {
              filterParam = {
                key: key,
                value: col['searchValue'],
                matchMode: col['matchMode'] || 'equals',
                dataType: col['dataType'],
                order: col['filterOrder']
              }
              this.rawQueryParams.filter.push(filterParam);
            }

            // this.rawQueryParams?.filter.forEach((item: any) => {
            //   if (item.key !== key) return;
            //   item.value = col['searchValue'];
            //   item.matchMode = col['matchMode'];
            // });

            if (this.rawQueryParams) this.rawQueryParams.pageIndex = 0;
          }
        })

        this.__onEvent(DomainListSenderEnum.onQueryParamsChange, this.rawQueryParams);
        return;
      case DomainListSenderEnum.reset:
        Object.keys(this.filterVisible).forEach((key: string) => {
          if (this.filterVisible[key] == true) {
            this.filterVisible[key] = false;

            let col: any = this.cols.find((item: any) => {
              return item.code === key
            })
            col['searchValue'] = undefined;
            this.searchValue = undefined;

            this.rawQueryParams?.filter.forEach((item: any) => {
              if (item.key !== key) return;
              item.value = col['searchValue'];
            });
          }
        })
        this.__onEvent(DomainListSenderEnum.onQueryParamsChange, this.rawQueryParams);
        return;
      case DomainListSenderEnum.__quickSearchKeyUp:
        this.quickSearchValueChange.emit(this.quickSearchValue);
        if (event.key === 'Enter' || event.keyCode === 13) {
          if (this.rawQueryParams === undefined) return;
          if (this.rawQueryParams.filter === undefined) {
            this.rawQueryParams.filter = [];
          }
          let filterParam = this.commonService.findItem('globalSearch', this.rawQueryParams.filter, 'key')
          if (filterParam) {
            filterParam.value = this.quickSearchValue;
          } else {
            filterParam = {
              key: 'globalSearch',
              value: this.quickSearchValue,
            }
            this.rawQueryParams.filter.push(filterParam);
          }
          this.rawQueryParams.pageIndex = 0;
          this.__onEvent(DomainListSenderEnum.onQueryParamsChange, this.rawQueryParams);
          this.__onEvent(DomainListSenderEnum.quickSearch, this.quickSearchValue);
        }
        break;
      case DomainListSenderEnum.__searchKeyUp:
        if (event.event.key === 'Enter' || event.event.keyCode === 13) {
          this.__onEvent(DomainListSenderEnum.search, event.searchValue);
        }
        break;
      case DomainListSenderEnum.__showRowContextMenu:
        if (!this.hasContextMenu) return
        this.__selectedItem = event.item;
        this.nzContextMenuService.create(event.event, event.menu);
        break;
      case DomainListSenderEnum.__onRowContextMenuClick:
        sender = DomainListSenderEnum.onClick;
        break;
    }

    if (sender?.startsWith('__')) return;

    let rtn = this.onEvent.emit({ sender: sender, event: event });
    if (rtn !== undefined && rtn === false) return;

    //preHandle event
  }

  /**
   * Xóa danh sách row được lựa chọn
   */
  clearSetOfSelection() {
    this.setOfSelection.clear();
  }

  updateSetOfSelection(data: any[]) {
    this.clearSetOfSelection();
    data.forEach((item: any) => {
      this.setOfSelection.add(item);
    })
  }

  /**
   * Lấy danh sách row được chọn
   */
  getSelectedRow() {
    return this.dataSet.filter((item: any) => {
      return this.setOfSelection.has(item[this.checkedKey]);
    })
  }

  __drop(event: CdkDragDrop<number[]>) {
    moveItemInArray(this.dataSet, event.previousIndex, event.currentIndex)

    this.__onEvent(DomainListSenderEnum.onDrop, {
      data: this.dataSet,
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex
    })
  }
}

export enum DomainListSenderEnum {
  __checkedChange = '__checkedChange',
  __checkedAllChange = '__checkedAllChange',
  __onRowContextMenuClick = '__onRowContextMenuClick',
  __quickSearchKeyUp = '__quickSearchKeyUp',
  __searchKeyUp = '__searchKeyUp',
  __showRowContextMenu = '__showRowContextMenu',
  checkedChange = 'checkedChange',
  currentPageDataChange = 'currentPageDataChange',
  expandChange = 'expandChange',
  nzVisibleChange = 'nzVisibleChange',
  onCellClick = 'onCellClick',
  onClick = 'onClick',
  onDrop = 'onDrop',
  onQueryParamsChange = 'onQueryParamsChange',
  quickSearch = 'quickSearch',
  reset = 'reset',
  search = 'search',
}