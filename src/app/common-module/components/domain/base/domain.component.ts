import { BaseDomainConfigTemplate } from "src/app/common-module/domain/base";
import { TableFilter } from "src/app/common-module/dto/table-filter";
import { BaseDomainService } from "src/app/common-module/services/base-domain/base-domain.service";
import { CommonService } from "src/app/common-module/services/common/common.service";
import { NotificationService } from "src/app/common-module/services/notification/notification.service";
import { DomainDetailComponent } from "../domain-detail/domain-detail.component";
import { ViewContainerRef } from "@angular/core";
import { AppComponent } from "src/app/app-module/app.component";
import { DomainListSenderEnum } from "../domain-list/domain-list.component";

export abstract class DomainBaseComponent {
    loading: boolean = false;
    dataPanelActive: boolean = false;

    selectedItem: any;

    totalRows: number = 0;
    dataSet: any[] = [];

    tableFilter: TableFilter = new TableFilter();

    domainConfigTemplate?: BaseDomainConfigTemplate;

    constructor(protected commonService: CommonService, protected notification: NotificationService, protected domainService: BaseDomainService) {
        AppComponent.wrapInCard = true
    }

    onInit(): void {
        this.loadConfigTemplate(this.domainConfigTemplate)
    }

    loadConfigTemplate(config?: BaseDomainConfigTemplate) {
        if (!config) {
            return;
        }

        config.onEvent = (sender: any, event: any) => {
        }
    }

    /**
     * Trả data theo id domain
     */
    getDataById(itemId: number, callback: any = { next: undefined, error: undefined, complete: undefined }) {
        this.onEvent('preGetDataById', itemId);

        this.commonService.addTotalRequest();
        this.domainService.get(itemId).subscribe({
            next: (value: any) => {
                this.commonService.addCompletedRequest();
                value = this.domainService.analyze(value);
                this.onEvent('onGetDataById', value);
                if (callback.next) return callback.next(value);
                return true;
            },
            error: (err: any) => {
                this.commonService.addCompletedRequest();
                if (callback.error) return callback.error(err);
            },
            complete: () => {
                if (callback.complete) return callback.complete();
            },
        })
    }

    reloadDataTable() {
        this.onEvent('preReloadDataTable');
        this.loading = true;

        this.domainService.loadDataTable(this.tableFilter).subscribe({
            next: (data: any) => {
                this.onEvent('onReloadDataTable', data);

                this.loading = false;
                this.totalRows = data.totalRows;
                this.dataSet = data.items.map((element: any) => {
                    element = this.domainService.analyze(element);
                    element = this.objectToRowData(element);
                    return element;
                });

                this.onEvent('postReloadDataTable');
            },
            error: (err: any) => {
                this.notification.create('error', "Error", err.error.message || err.message);
                this.loading = false;
                this.totalRows = 0;
            },
            complete: () => {
            }
        })
    }

    onEvent(sender: DomainBaseSenderType | any, event?: any) {
        switch (sender) {
            case 'onClick':
                switch (event.code) {
                    case 'data':
                        this.dataPanelActive = !this.dataPanelActive;
                        this.selectedItem = event.value;
                        break;
                    case 'create':
                        this.commonService.showDetailFormModal({
                            title: 'Create',
                            width: this.domainConfigTemplate?.detailModalWidth,
                            refContent: DomainDetailComponent,
                            formFields: this.domainConfigTemplate?.createFormFields,
                            okCallback: (refContent: any, data: any) => {
                                if (!refContent.validateForm.valid) {
                                    this.notification.create('error', 'Có lỗi', 'Plz check Input...');
                                    return false;
                                }
                                data = this.formDataToObject(data);
                                let _data = this.domainService.validate(data);
                                this.commonService.addTotalRequest();
                                this.domainService.create(_data).subscribe({
                                    next: (value: any) => {
                                        this.notification.create('success', "Success", "OK");
                                    },
                                    error: (err: any) => {
                                        this.commonService.addCompletedRequest();
                                        this.notification.create('error', "Error", err.error.message || err.message);
                                    },
                                    complete: () => {
                                        this.commonService.addCompletedRequest();
                                        this.reloadDataTable();
                                    }
                                });
                                return true;
                            }
                        });
                        break;
                    case 'update':
                        this.getDataById(event.value.id, {
                            next: (value: any) => {
                                value = this.objectToFormData(value);

                                this.commonService.showDetailFormModal({
                                    title: 'Update',
                                    width: this.domainConfigTemplate?.detailModalWidth,
                                    refContent: DomainDetailComponent,
                                    formFields: this.domainConfigTemplate?.updateFormFields,
                                    returnRawData: true,
                                    data: value,
                                    okCallback: (refContent: any, data: any) => {
                                        if (!refContent.validateForm.valid) {
                                            this.notification.create('warning', 'Warning', 'Plz input missing params')
                                            return false;
                                        }
                                        data.id = value.id;
                                        data = this.formDataToObject(data);
                                        let _data = this.domainService.validate(data);
                                        this.commonService.addTotalRequest();
                                        this.domainService.update(_data).subscribe({
                                            next: (value: any) => {
                                                this.notification.create('success', "Success", "OK");
                                            },
                                            error: (err: any) => {
                                                this.commonService.addCompletedRequest();
                                                this.notification.create('error', "Error", err.error.message || err.message);
                                            },
                                            complete: () => {
                                                this.commonService.addCompletedRequest();
                                                this.reloadDataTable();
                                            }
                                        });
                                        return true;
                                    }
                                });
                            },
                            error: (err: any) => {
                                this.notification.create('error', "Error", err.error.message || err.message);
                            },
                            complete: () => {
                            },
                        })
                        break;
                    case 'detail':
                        this.getDataById(event.value.id, {
                            next: (value: any) => {
                                this.commonService.showDetailFormModal({
                                    title: 'Detail',
                                    width: this.domainConfigTemplate?.detailModalWidth,
                                    refContent: DomainDetailComponent,
                                    formFields: this.domainConfigTemplate?.detailFormFields,
                                    returnRawData: true,
                                    data: value,
                                    okCallback: (refContent: any, formData: any) => {
                                    }
                                });
                            },
                            error: (err: any) => {
                                this.notification.create('error', "Error", err.error.message || err.message);
                            },
                            complete: () => {
                            },
                        })
                        break;
                    case 'delete':
                        this.commonService.addTotalRequest();
                        this.domainService.delete(event.value.id).subscribe({
                            next: (value: any) => {
                                this.notification.create('success', "Success", "OK");
                            },
                            error: (err: any) => {
                                this.commonService.addCompletedRequest();
                                this.notification.create('error', "Error", err.error.message || err.message);
                            },
                            complete: () => {
                                this.commonService.addCompletedRequest();
                                this.reloadDataTable();
                            }
                        })
                        break;
                    default:
                        break;
                }
                break;
            case DomainListSenderEnum.onQueryParamsChange:
                this.tableFilter = event;
                this.reloadDataTable();
                break;
            case 'panelActiveChange':
                if (event) {
                    this.dataPanelActive = !event;
                }
                break;
        }
    }

    /**
     * Chuyển đổi từ domain object --> form data
     * @param data 
     * @returns 
     */
    objectToFormData(data: any) {
        return data;
    }

    /**
     * Chuyển đổi từ form data --> domain object
     * @param data 
     * @returns 
     */
    formDataToObject(data: any) {
        return data;
    }

    /**
     * Chuyển đổi từ domain object --> row data
     * @param data 
     * @returns 
     */
    objectToRowData(data: any) {
        return data;
    }
}


export enum DomainBaseSenderType {
    /**
     * Kích hoạt khi có sự kiện người dùng click vào cell
     * 
     * Trả ra đối tượng OnCellClickEvent
     */
    onCellClick = 'onCellClick',

    /**
     * Kích hoạt khi có sự kiện thao tác click đối tượng trên giao diện
     */
    onClick = 'onClick',

    /**
     * Kích hoạt khi có sự kiện thao tác click nút expand của dòng
     * 
     * Trả ra đối tượng OnExpandChangeEvent
     */
    onExpandChange = 'expandChange',

    onGetDataById = 'onGetDataById',

    onQueryParamsChange = 'onQueryParamsChange',

    /**
     * Kích hoạt khi server trả về data (fe chưa xử lý data)
     */
    onReloadDataTable = 'onReloadDataTable',

    /**
     * Kích hoạt sau khi fe xử lý data
     */
    postReloadDataTable = 'postReloadDataTable',

    preGetDataById = 'preGetDataById',

    /**
     * Kích hoạt trước khi thực hiện load data mặc định
     */
    preReloadDataTable = 'preReloadDataTable',
}

export interface OnCellClickEvent {
    /**
     * Cột dữ liệu được click
     */
    code: string;
    /**
     * Dòng dữ liệu được click
     */
    value: Record<string, any>;
}

export interface OnExpandChangeEvent {
    /**
     * Dòng dữ liệu được click
     */
    item: Record<string, any>;
    /**
     * Trạng thái có expand hay collapse
     */
    value: boolean;

    /**
     * ViewContainerRef để truyền component trường hợp không có ExpandRowComponent mặc định 
     */
    viewContainerRef?: ViewContainerRef;
}