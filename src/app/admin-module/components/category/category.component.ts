import { Component, OnInit } from '@angular/core';
import { DomainBaseComponent } from 'src/app/common-module/components/domain/base/domain.component';
import { DomainDetailComponent } from 'src/app/common-module/components/domain/domain-detail/domain-detail.component';
import { BaseDomainConfigTemplate } from 'src/app/common-module/domain/base';
import { TableFilter } from 'src/app/common-module/dto/table-filter';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { NotificationService } from 'src/app/common-module/services/notification/notification.service';
import { CategoryConfigTemplate } from '../../domain/category.dto';
import { CategoryDataConfigTemplate } from '../../domain/category-data';
import { CategoryService } from '../../services/category/category.service';
import { CategoryDataService } from '../../services/categoryData/category-data.service';
import { AppComponent } from 'src/app/app-module/app.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent extends DomainBaseComponent implements OnInit {
  override domainConfigTemplate: BaseDomainConfigTemplate = new CategoryConfigTemplate();
  override domainService: CategoryService;

  selectedCategory: any;
  cdConfigTemplate: BaseDomainConfigTemplate = new CategoryDataConfigTemplate();
  cdDataSet: any[] = [];
  cdTotalRows: number = 0;
  cdTableFilter: TableFilter = new TableFilter();

  constructor(commonService: CommonService, notification: NotificationService, domainService: CategoryService, private cdService: CategoryDataService) {
    super(commonService, notification, domainService);
    AppComponent.wrapInCard = false;

    this.domainConfigTemplate.detailModalWidth = "50%";
    this.domainService = domainService;
  }

  ngOnInit(): void {
    this.cdConfigTemplate.tableColumnActions = [
      {
        code: 'cdUpdate', name: 'button.update.label', icon: 'edit', onEvent: (sender, event) => {
          this.onEvent(sender, event);
        }
      },
      {
        code: 'cdDelete', name: 'button.delete.label', icon: 'delete', onEvent: (sender, event) => {
          this.onEvent(sender, event);
        }
      }
    ]

    this.cdConfigTemplate.actions = [
      {
        code: 'cdCreate', name: 'button.create.label', icon: 'plus', onEvent: (sender, event) => {
          this.onEvent(sender, event);
        }
      },
      {
        code: 'cdUpload', name: 'Upload', icon: 'upload',
        onEvent: (sender, event) => { this.onEvent(sender, event); }
      }
    ]

    this.onInit();
    this.loadConfigTemplate(this.cdConfigTemplate);
  }

  override onEvent(sender: any, event?: any): void {
    super.onEvent(sender, event);
    switch (sender) {
      case 'onClick':
        switch (event.code) {
          case 'data': {
            this.selectedCategory = event.value;
            this.onEvent('onCdQueryParamsChange', this.cdTableFilter);
            break;
          }
          default:
            console.log(event);
            break;
        }
        break
      case 'onCdEvent':
        sender = event.sender;
        event = event.event;
        switch (sender) {
          case 'onClick':
            switch (event.code) {
              case 'cdCreate':
                this.commonService.showDetailFormModal({
                  title: 'Create',
                  width: this.cdConfigTemplate?.detailModalWidth,
                  refContent: DomainDetailComponent,
                  formFields: this.cdConfigTemplate?.createFormFields,
                  okCallback: (refContent: any, data: any) => {
                    if (!refContent.validateForm.valid) {
                      this.notification.create('error', 'Có lỗi', 'Plz check Input...');
                      return false;
                    }
                    let _data = this.cdService.validate(data);
                    _data.category = { id: this.selectedCategory.id };
                    _data.categoryId = this.selectedCategory.id;
                    this.commonService.addTotalRequest();
                    this.cdService.create(_data).subscribe({
                      next: (value: any) => {
                        this.notification.create('success', "Success", "OK");
                      },
                      error: (err: any) => {
                        this.commonService.addCompletedRequest();
                        this.notification.create('error', "Error", err.error.message || err.message);
                      },
                      complete: () => {
                        this.commonService.addCompletedRequest();
                        this.cdReloadDataTable();
                      }
                    });
                    return true;
                  }
                });
                break;
              case 'cdUpdate':
                this.commonService.addTotalRequest();
                this.cdService.get(event.value.id).subscribe({
                  next: (value: any) => {
                    if (value.props) value.props = JSON.stringify(value.props)
                    this.commonService.showDetailFormModal({
                      title: 'Update',
                      width: this.cdConfigTemplate?.detailModalWidth,
                      refContent: DomainDetailComponent,
                      formFields: this.cdConfigTemplate?.updateFormFields,
                      returnRawData: false,
                      data: value,
                      okCallback: (refContent: any, data: any) => {
                        if (!refContent.validateForm.valid) {
                          this.notification.create('warning', 'Warning', 'Plz input missing params')
                          return false;
                        }
                        data.id = value.id;
                        if (data.props) data.props = JSON.parse(data.props)
                        data.category = { id: this.selectedCategory.id };
                        data.categoryId = this.selectedCategory.id;
                        let _data = this.cdService.validate(data);
                        this.commonService.addTotalRequest();
                        this.cdService.update(_data).subscribe({
                          next: (value: any) => {
                            this.notification.create('success', "Success", "OK");
                          },
                          error: (err: any) => {
                            this.commonService.addCompletedRequest();
                            this.notification.create('error', "Error", err.error.message || err.message);
                          },
                          complete: () => {
                            this.commonService.addCompletedRequest();
                            this.cdReloadDataTable();
                          }
                        });
                        return true;
                      }
                    });
                  },
                  error: (err: any) => {
                    this.commonService.addCompletedRequest();
                    this.notification.create('error', "Error", err.error.message || err.message);
                  },
                  complete: () => {
                    this.commonService.addCompletedRequest();
                  },
                })
                break;
              case 'cdDelete':
                this.commonService.showConfirmModal({
                  title: 'Confirm', refContent: this.cdConfigTemplate?.deleteConfirmMessage, okCallback: () => {
                    this.commonService.addTotalRequest();
                    this.cdService.delete(event.value.id).subscribe({
                      next: (value: any) => {
                        this.notification.create('success', "Success", "OK");
                      },
                      error: (err: any) => {
                        this.commonService.addCompletedRequest();
                        this.notification.create('error', "Error", err.error.message || err.message);
                      },
                      complete: () => {
                        this.commonService.addCompletedRequest();
                        this.cdReloadDataTable();
                      }
                    })
                  }
                })
                break;
            }
        }
        return
      case 'panelActiveChange':
        if (event) {
          this.selectedCategory = undefined;
        }
        break;
      case 'onCdQueryParamsChange':
        this.cdTableFilter = event;
        if (this.dataPanelActive) {
          this.cdReloadDataTable();
        }
        break;
    }
  }

  cdReloadDataTable() {
    this.loading = true;
    this.domainService.getCategoryDataByCategoryCode(this.selectedCategory.code).subscribe({
      next: (data: any[]) => {
        this.loading = false;
        this.cdTotalRows = data.length;
        this.cdDataSet = data;
      },
      error: (err: any) => {
        this.notification.create('error', "Error", err.error.message || err.message);
        this.loading = false;
        this.cdTotalRows = 0;
      },
      complete: () => {
      }
    })
  }
}
