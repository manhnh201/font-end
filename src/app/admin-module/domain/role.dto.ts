import { BaseDomainConfigTemplate } from "src/app/common-module/domain/base";
import { IAction } from "src/app/common-module/dto/action.dto";
import { FormField } from "src/app/common-module/dto/form-field.dto";
import { TableColumn } from "src/app/common-module/dto/table-column";

export class RoleConfigTemplate extends BaseDomainConfigTemplate {
    override detailModalWidth: string = '25%';

    override detailFormFields: FormField[] = [
        {
            code: 'authority', name: "Authority", span: 24, type: 'text',
            disabled: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'priority', name: "Priority", span: 24, type: 'number',
            disabled: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        }
    ];
    override createFormFields: FormField[] = [
        {
            code: 'authority', name: "Authority", span: 24, type: 'text', placeholder: 'Enter role authority',
            required: true, minLength: 3, maxLength: 64,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'priority', name: "Priority", span: 24, type: 'number', placeholder: 'Enter role priority',
            required: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        }
    ];
    override updateFormFields: FormField[] = [
        {
            code: 'authority', name: "Authority", span: 24, type: 'text', placeholder: 'Enter role authority',
            disabled: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'priority', name: "Priority", span: 24, type: 'number', placeholder: 'Enter role priority',
            required: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        }
    ];

    override tableColumns: TableColumn[] = [
        { code: 'id', name: 'ID', headerStyle: "text-align: center; width: 5rem;", dataStyle: "text-align: center; width: 5rem;" },
        { code: 'authority', name: 'Authority', headerStyle: "text-align: center" },
        { code: 'priority', name: 'Priority', headerStyle: "text-align: center; width: 5rem;", dataStyle: "text-align: center; width: 5rem;" },
        { code: 'createdBy', name: 'Created By', headerStyle: "text-align: center" },
        { code: 'updatedBy', name: 'Updated By', headerStyle: "text-align: center" },
    ]

    override tableColumnActions: IAction[] = [
        {
            code: 'data', name: 'Data', icon: 'unordered-list', onEvent: (sender, event) => {
                this.onEvent(sender, event);
            }
        },
        {
            code: 'update', name: 'button.update.label',icon: 'edit', onEvent: (sender, event) => {
                this.onEvent(sender, event);
            }
        },
        {
            code: 'delete', name: 'button.delete.label', icon: 'delete', onEvent: (sender, event) => {
                this.onEvent(sender, event);
            }
        }
    ];
}