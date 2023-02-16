import { BaseDomainConfigTemplate } from "src/app/common-module/domain/base";
import { FormField } from "src/app/common-module/dto/form-field.dto";
import { TableColumn } from "src/app/common-module/dto/table-column";
import { environment } from "src/environments/environment";

export class MenuConfigTemplate extends BaseDomainConfigTemplate {

    override detailModalWidth = "50%";

    override createFormFields: FormField[] = [
        {
            code: 'code', name: "Code", span: 12, type: 'text', placeholder: 'Enter menu code',
            required: true, minLength: 3, maxLength: 32,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'name', name: "Name", span: 12, type: 'text', placeholder: 'Enter menu name',
            required: true, minLength: 3, maxLength: 255,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'href', name: "Href", span: 24, type: 'text', placeholder: 'Enter menu href',
            required: true, maxLength: 255,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'parentId', name: "Parent Menu", span: 12, type: 'select',
            selectSource: 'api', selectLabelKey: ['id', 'name'], selectValueKey: 'id', selectSourceUrl: `${environment.apiUrl}/api/v1/menu`,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'icon', name: "Icon", span: 12, type: 'text', placeholder: 'Enter menu icon',
            maxLength: 255,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'ord', name: "Ord", span: 12, type: 'number',
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'hide', name: "Hide", span: 12, type: 'switch',
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'description', name: "Description", span: 24, type: 'textarea',
            maxLength: 255,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
    ];

    override updateFormFields: FormField[] = [
        {
            code: 'code', name: "Code", span: 12, type: 'text', placeholder: 'Enter menu code',
            required: true, minLength: 3, maxLength: 32,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'name', name: "Name", span: 12, type: 'text', placeholder: 'Enter menu name',
            required: true, minLength: 3, maxLength: 255,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'href', name: "Href", span: 24, type: 'text', placeholder: 'Enter menu href',
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'parentId', name: "Parent Menu", span: 12, type: 'select',
            selectSource: 'api', selectLabelKey: ['id', 'name'], selectValueKey: 'id', selectSourceUrl: `${environment.apiUrl}/api/v1/menu`,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'icon', name: "Icon", span: 12, type: 'text', placeholder: 'Enter menu icon',
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'ord', name: "Ord", span: 12, type: 'number',
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'hide', name: "Hide", span: 12, type: 'switch',
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'description', name: "Description", span: 24, type: 'textarea',
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
    ];

    override tableColumns: TableColumn[] = [
        { code: 'id', name: 'ID', headerStyle: "text-align: center; width: 5rem;", dataStyle: "text-align: center; width: 5rem;" },
        { code: 'code', name: 'Code', headerStyle: "text-align: center;", filter: true, matchMode: 'contains', sortDirections: ['ascend', 'descend', null] },
        { code: 'name', name: 'Name', headerStyle: "text-align: center", filter: true, matchMode: 'contains', sortDirections: ['ascend', 'descend', null] },
        // { code: 'icon', name: 'Icon', tag: 'icon', headerStyle: "text-align: center", dataStyle: "text-align: center" },
        { code: 'href', name: 'Href', headerStyle: "text-align: center", filter: true, matchMode: 'contains', sortDirections: ['ascend', 'descend', null] },
        { code: 'parentId', name: 'Parent ID', headerStyle: "text-align: center", dataStyle: "text-align: center", sortDirections: ['ascend', 'descend', null], filter: true, filterType: 'text', matchMode: 'equals' },
        { code: 'ord', name: 'Ord', headerStyle: "text-align: center", dataStyle: "text-align: center", sortDirections: ['ascend', 'descend', null] },
        { code: 'hide', name: 'Hide', tag: 'check', headerStyle: "text-align: center", dataStyle: "text-align: center", sortDirections: ['ascend', 'descend', null] },
        { code: 'createdAt', name: 'Created At', headerStyle: "text-align: center", dataStyle: "text-align: center", pipe: 'date', filter: true, matchMode: 'between', sortDirections: ['ascend', 'descend', null] },
    ]
}