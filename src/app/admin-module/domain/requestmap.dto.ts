import { BaseDomainConfigTemplate } from "src/app/common-module/domain/base";
import { FormField } from "src/app/common-module/dto/form-field.dto";
import { TableColumn } from "src/app/common-module/dto/table-column";

export class RequestmapConfigTemplate extends BaseDomainConfigTemplate {
    override detailModalWidth: string = "50%";

    override createFormFields: FormField[] = [
        {
            code: 'url', name: "URL", span: 24, type: 'text', placeholder: 'Enter request URL',
            required: true, maxLength: 255, pattern: "^/.*",
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'httpMethod', name: "Method", span: 12, type: 'select',
            options: [{ label: 'POST', value: 'POST' }, { label: 'GET', value: 'GET' }, { label: 'PUT', value: 'PUT' }, { label: 'DELETE', value: 'DELETE' }],
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'active', name: "Active", span: 12, type: 'switch',
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'configAttributes', name: "Attributes", span: 24, type: 'select', selectMode: 'multiple', placeholder: 'Select requestmap config attributes',
            required: true,
            options: [],
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        }
    ];
    
    override updateFormFields: FormField[] = [
        {
            code: 'url', name: "URL", span: 24, type: 'text', placeholder: 'Enter request URL',
            disabled: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'httpMethod', name: "Method", span: 12, type: 'select',
            options: [{ label: 'POST', value: 'POST' }, { label: 'GET', value: 'GET' }, { label: 'PUT', value: 'PUT' }, { label: 'DELETE', value: 'DELETE' }],
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'active', name: "Active", span: 12, type: 'switch',
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'configAttributes', name: "Attributes", span: 24, type: 'select', selectMode: 'multiple', placeholder: 'Select requestmap config attributes',
            required: true,
            options: [],
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
    ];

    override tableColumns: TableColumn[] = [
        { code: 'id', name: 'ID', headerStyle: "text-align: center; width: 5rem;", dataStyle: "text-align: center; width: 5rem;" },
        { code: 'url', name: 'URL', headerStyle: "text-align: center;", filter: true, filterType: 'text', matchMode: 'contains', sortDirections: ['ascend', 'descend', null] },
        { code: 'configAttributes', name: 'Attributes', headerStyle: "text-align: center", tag: 'tag' },
        { code: 'httpMethod', name: 'Method', headerStyle: "text-align: center", dataStyle: "text-align: center" },
        { code: 'active', name: 'Active', tag: 'check', headerStyle: "text-align: center", dataStyle: "text-align: center" },
    ]
}