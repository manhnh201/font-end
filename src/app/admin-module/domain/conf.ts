import { BaseDomainConfigTemplate } from "src/app/common-module/domain/base";
import { FormField } from "src/app/common-module/dto/form-field.dto";
import { TableColumn } from "src/app/common-module/dto/table-column";

export class ConfConfigTemplate extends BaseDomainConfigTemplate {
    override detailFormFields: FormField[] = [
        {
            code: 'name', name: "Name", span: 12, type: 'text',
            disabled: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'tag', name: "Tag", span: 12, type: 'text',
            disabled: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'value', name: "Value", span: 24, type: 'textarea', rows: 4,
            disabled: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
    ];
    override createFormFields: FormField[] = [
        {
            code: 'name', name: "Name", span: 12, type: 'text', placeholder: 'Enter conf name',
            required: true, minLength: 3, maxLength: 64, pattern: "^[a-z]+.*",
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'tag', name: "Tag", span: 12, type: 'select', placeholder: 'Enter conf tag',
            options: [
                { label: 'FOLDER_CONF', value: 'FOLDER_CONF' },
                { label: 'OTHER_CONF', value: 'OTHER_CONF' },
                { label: 'ROLE_CONF', value: 'ROLE_CONF' },
                { label: 'WEB_CONF', value: 'WEB_CONF' },
            ],
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'value', name: "Value", span: 24, type: 'textarea', rows: 4,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
    ];
    override updateFormFields: FormField[] = [
        {
            code: 'name', name: "Name", span: 12, type: 'text', placeholder: 'Enter conf name',
            required: true, minLength: 3, maxLength: 64,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'tag', name: "Tag", span: 12, type: 'select', placeholder: 'Enter conf tag',
            options: [
                { label: 'FOLDER_CONF', value: 'FOLDER_CONF' },
                { label: 'OTHER_CONF', value: 'OTHER_CONF' },
                { label: 'ROLE_CONF', value: 'ROLE_CONF' },
                { label: 'WEB_CONF', value: 'WEB_CONF' },
            ],
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'value', name: "Value", span: 24, type: 'textarea', rows: 4,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
    ];

    override tableColumns: TableColumn[] = [
        { code: 'id', name: 'ID', headerStyle: "text-align: center; width: 5rem;", dataStyle: "text-align: center; width: 5rem;" },
        { code: 'name', name: 'Name', headerStyle: "text-align: center" },
        { code: 'tag', name: 'Tag', headerStyle: "text-align: center" },
        { code: 'value', name: 'Value', headerStyle: "text-align: center" }
    ]
}