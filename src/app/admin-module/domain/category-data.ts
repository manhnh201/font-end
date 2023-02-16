import { BaseDomainConfigTemplate } from "src/app/common-module/domain/base";
import { IAction } from "src/app/common-module/dto/action.dto";
import { FormField } from "src/app/common-module/dto/form-field.dto";
import { TableColumn } from "src/app/common-module/dto/table-column";

export class CategoryDataConfigTemplate extends BaseDomainConfigTemplate {
    override detailModalWidth: string = '50%';

    override createFormFields: FormField[] = [
        {
            code: 'code', name: "Code", span: 12, type: 'text',
            required: true, maxLength: 32,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'lang', name: "Lang", span: 12, type: 'text',
            required: true, maxLength: 32,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'value', name: "Value", span: 24, type: 'text', rows: 3,
            required: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'props', name: "Props", span: 24, type: 'textarea', rows: 5,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
    ];
    override updateFormFields: FormField[] = [
        {
            code: 'code', name: "Code", span: 12, type: 'text',
            disabled: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'lang', name: "Lang", span: 12, type: 'text',
            disabled: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'value', name: "Value", span: 24, type: 'text', rows: 3,
            required: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'props', name: "Props", span: 24, type: 'textarea', rows: 5,
            tryPreview: true, resourceType: 'json',
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
    ];

    override tableColumns: TableColumn[] = [
        { code: 'id', name: 'ID', headerStyle: "text-align: center; width: 5rem;", dataStyle: "text-align: center; width: 5rem;" },
        { code: 'code', name: 'Code', headerStyle: "text-align: center; width: 10rem;", dataStyle: "text-align: center; width: 10rem;" },
        { code: 'value', name: 'Value', headerStyle: "text-align: center" },
        { code: 'lang', name: 'Lang', headerStyle: "text-align: center; width: 5rem;", dataStyle: "text-align: center; width: 5rem;" },
    ]

    override tableColumnActions: IAction[] = [
        {
            code: 'update', name: 'button.update.label', icon: 'edit', onEvent: (sender, event) => {
                this.onEvent(sender, event);
            }
        },
        {
            code: 'delete', name: 'button.delete.label', icon: 'delete',
            needConfirm: true, confirmMessage: 'Are you sure?',
            onEvent: (sender, event) => { this.onEvent(sender, event); }
        }
    ];
}