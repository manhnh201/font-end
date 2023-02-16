import { BaseDomainConfigTemplate } from 'src/app/common-module/domain/base';
import { IAction } from 'src/app/common-module/dto/action.dto';
import { TableColumn } from 'src/app/common-module/dto/table-column';


export class PeriOrderConfigTemplate extends BaseDomainConfigTemplate {
    override detailModalWidth: string = '75%';

    override tableColumns: TableColumn[] = [
        {
            code: 'ticker', name: 'Ticker', headerStyle: "text-align: center; width: auto;", dataStyle: "text-align: center;",
            filter: true, matchMode: "equals", filterType: 'text', searchCode: 'ticker', selectSource: "static",
            selectLabelKey: 'ticker', selectDataKey: 'data', selectValueKey: '_id',
        },
        { code: 'value', name: 'Value', headerStyle: "text-align: center; width: auto;", dataStyle: "text-align: right;", tag: 'html', },
        { code: 'quantity', name: 'Quantity', headerStyle: "text-align: center; width: auto;", dataStyle: "text-align: right;", tag: 'html', },
        { code: 'price', name: 'Price', headerStyle: "text-align: center; width: auto;", dataStyle: "text-align: right;", tag: 'html', },
        {
            code: 'excDate', name: 'Exc Date', headerStyle: "text-align: center; width: 8rem;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "dateRangePicker", matchMode: "between"
        },
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
            code: 'priceType', name: 'Price Type', headerStyle: "text-align: center; width: 8rem;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "text", matchMode: "equals"
        },
        {
            code: 'brId', name: 'Br ID', headerStyle: "text-align: center; width: 5rem;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "text", matchMode: "contains"
        },
        {
            code: 'errCode', name: 'Error Code', headerStyle: "text-align: center; width: 8rem;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "text", matchMode: "equals"
        },
        { code: 'errMessage', name: 'Err Message', headerStyle: "text-align: center; width: 30rem;", dataStyle: "text-align: left;", tag: 'html' },

    ]

    override actions: IAction[] = [
        {
            code: 'retry', name: 'Retry', icon: 'reload', tooltip: 'button.retry.tooltip',
            needConfirm: true, confirmMessage: "Bạn có muốn thực hiện thao tác thử lại nhiều bản ghi?",
            onEvent: (sender, event) => {
                this.onEvent(sender, event);
            }
        },
    ]

    override tableColumnActions: IAction[] = []
}