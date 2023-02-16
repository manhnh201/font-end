import { BaseDomainConfigTemplate } from 'src/app/common-module/domain/base';
import { IAction } from 'src/app/common-module/dto/action.dto';
import { TableColumn } from 'src/app/common-module/dto/table-column';


export class FeedbackConfigTemplate extends BaseDomainConfigTemplate {
    override detailModalWidth: string = '75%';

    override tableColumns: TableColumn[] = [
        { code: 'cusId', name: 'CusId', headerStyle: "text-align: center;", dataStyle: "text-align: left;", tag: 'html', },
        { code: 'type', name: 'Type', headerStyle: "text-align: center;", dataStyle: "text-align: left;", tag: 'html', },
        { code: 'content', name: 'Content', headerStyle: "text-align: center;", dataStyle: "text-align: left;", tag: 'html', },
        {
            code: 'createdDate', name: 'Created Date', headerStyle: "text-align: center;", dataStyle: "text-align: center;", tag: 'html',
            filter: true, filterType: "dateRangePicker", matchMode: "between"
        },
        {
            code: 'status', name: 'Status', headerStyle: "text-align: center;", dataStyle: "text-align: center;", tag: 'html',
        },

    ]

    override actions: IAction[] = [
        {
            code: 'export', name: 'Export', icon: 'export', tooltip: 'Export Excel',
            needConfirm: true, confirmMessage: "Bạn có chắc chắn muốn xuất file excel không?",
            onEvent: (sender, event) => {
                this.onEvent(sender, event);
            }
        },
    ]

    override tableColumnActions: IAction[] = [
        
    ]
}