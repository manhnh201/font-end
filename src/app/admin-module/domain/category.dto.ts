import { BaseDomainConfigTemplate } from "src/app/common-module/domain/base";
import { IAction } from "src/app/common-module/dto/action.dto";
import { FormField } from "src/app/common-module/dto/form-field.dto";
import { TableColumn } from "src/app/common-module/dto/table-column";

export class CategoryConfigTemplate extends BaseDomainConfigTemplate {
    override createFormFields: FormField[] = [
        {
            code: 'code', name: "Code", span: 12, type: 'text', placeholder: 'Enter category code',
            required: true, maxLength: 32, minLength: 3, pattern: "^[a-z]+.*$",
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'name', name: "Name", span: 12, type: 'text', placeholder: 'Enter category name',
            required: true, maxLength: 255, minLength: 3,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'active', name: "Active", span: 24, type: 'switch',
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'description', name: "Description", span: 24, type: 'textarea', rows: 4,
            maxLength: 255,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
    ];
    override updateFormFields: FormField[] = [
        {
            code: 'code', name: "Code", span: 12, type: 'text', placeholder: 'Enter category code',
            required: true, maxLength: 32, disabled: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'name', name: "Name", span: 12, type: 'text', placeholder: 'Enter category name',
            required: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'active', name: "Active", span: 24, type: 'switch',
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'description', name: "Description", span: 24, type: 'textarea',
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
    ];

    override tableColumns: TableColumn[] = [
        { code: 'id', name: 'ID', headerStyle: "text-align: center; width: 5rem;", dataStyle: "text-align: center; width: 5rem;", sortDirections: ['ascend', 'descend', null] },
        { code: 'code', name: 'Code', headerStyle: "text-align: center;", sortDirections: ['ascend', 'descend', null] },
        { code: 'name', name: 'Name', headerStyle: "text-align: center", sortDirections: ['ascend', 'descend', null] },
    ]

    override tableColumnActions: IAction[] = [
        {
            code: 'data', name: 'Category Data', icon: 'unordered-list',
            onEvent: (sender, event) => { this.onEvent(sender, event); }
        },
        {
            code: 'update', name: 'button.update.label', icon: 'edit',
            onEvent: (sender, event) => { this.onEvent(sender, event); }
        },
        {
            code: 'delete', name: 'button.delete.label', icon: 'delete',
            needConfirm: true, confirmMessage: 'Are you sure?',
            onEvent: (sender, event) => { this.onEvent(sender, event); }
        }
    ];
}