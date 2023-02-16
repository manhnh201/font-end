import { BaseDomainConfigTemplate } from 'src/app/common-module/domain/base';
import { IAction } from 'src/app/common-module/dto/action.dto';
import { TableColumn } from 'src/app/common-module/dto/table-column';


export class OrderListConfigTemplate extends BaseDomainConfigTemplate {
    override detailModalWidth: string = '75%';

    override tableColumns: TableColumn[] = [
        {
            code: 'custodycd', name: 'Custodycd', headerStyle: "text-align: center; width: auto;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "text", matchMode: "contains"
        },
        {
            code: 'customerid', name: 'Customer ID', headerStyle: "text-align: center; width: 8rem;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "text", matchMode: "contains"
        },
        {
            code: 'afacctno', name: 'Afacct No', headerStyle: "text-align: center; width: 8rem;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "text", matchMode: "contains"
        },
        {
            code: 'ticker', name: 'Ticker', headerStyle: "text-align: center; width: auto;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "text", matchMode: "contains"
        },
        {
            code: 'cdcontent', name: 'Stock Ex.', headerStyle: "text-align: center;  width: 8rem;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "text", matchMode: "contains"
        },
        {
            code: 'buyingValue', name: 'Buying Value', headerStyle: "text-align: center; width: 8rem;", dataStyle: "text-align: right;", tag: 'html',
            filter: false, filterType: "text", matchMode: "contains"
        },
        {
            code: 'priceType', name: 'Price Type', headerStyle: "text-align: center; width: 8rem;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "text", matchMode: "equals"
        },
        {
            code: 'frequency', name: 'Frequency', headerStyle: "text-align: center; width: auto;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "text", matchMode: "equals"
        },
        {
            code: 'pernament', name: 'Pernament', headerStyle: "text-align: center; width: auto;", dataStyle: "text-align: center;", tag: 'check',
            filter: false, filterType: "text", matchMode: "equals"
        },
        {
            code: 'orderStatus', name: 'Status', headerStyle: "text-align: center; width: 5rem;", dataStyle: "text-align: center;",
            filter: true, filterType: "text", matchMode: "equals"
        },
        {
            code: 'orderDate', name: 'Order Date', headerStyle: "text-align: center; width: 8rem;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "dateRangePicker", dataType: 'datetime', filterModifyTime: true, matchMode: "between"
        },
        {
            code: 'startDate', name: 'Start Date', headerStyle: "text-align: center; width: 8rem;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "dateRangePicker", dataType: 'datetime', filterModifyTime: true, matchMode: "between"
        },
        {
            code: 'endDate', name: 'End Date', headerStyle: "text-align: center; width: 8rem;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "dateRangePicker", dataType: 'datetime', filterModifyTime: true, matchMode: "between"
        },
        {
            code: 'scheduleDate', name: 'Schedule Date', headerStyle: "text-align: center; width: 10rem;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "dateRangePicker", dataType: 'datetime', filterModifyTime: true, matchMode: "between"
        },
        {
            code: 'clientIp', name: 'Client Ip', headerStyle: "text-align: center; width: auto;", dataStyle: "text-align: center;",
            filter: false, filterType: "text", matchMode: "equals"
        },
        {
            code: 'brId', name: 'Br Id', headerStyle: "text-align: center; width: 5rem;", dataStyle: "text-align: center;",
            filter: true, filterType: "text", matchMode: "contains"
        },

    ]

    override actions: IAction[] = [
        {
            code: 'retry', name: 'Retry', icon: 'reload', tooltip: 'button.retry.tooltip',
            needConfirm: false, confirmMessage: "Bạn có muốn thực hiện thao tác thử lại nhiều bản ghi?",
            onEvent: (sender, event) => {
                this.onEvent(sender, event);
            }
        },
    ]

    override tableColumnActions: IAction[] = [
        {
            code: 'detail', name: 'Chi tiết', icon: 'search', tooltip: 'button.detail.tooltip',
            onEvent: (sender, event) => {
                this.onEvent(sender, event);
            }
        },
    ]
}