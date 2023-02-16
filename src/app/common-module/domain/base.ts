import { IAction } from "../dto/action.dto";
import { FormField } from "../dto/form-field.dto";
import { TableColumn } from "../dto/table-column";

export class BaseDomainConfigTemplate {
    detailFormFields: FormField[] = [];
    createFormFields: FormField[] = [];
    updateFormFields: FormField[] = [];
    tableColumns: TableColumn[] = [];

    detailModalWidth = "75%";
    deleteConfirmMessage: string = 'Are you sure?'

    actions: IAction[] = [
        {
            code: 'create', name: 'button.create.label', icon: 'plus', tooltip: 'button.create.tooltip',
            onEvent: (sender, event) => {
                this.onEvent(sender, event);
            }
        },
    ]

    tableColumnActions: IAction[] = [
        {
            code: 'update', name: 'button.update.label',icon: 'edit', tooltip: 'button.update.tooltip',
            onEvent: (sender, event) => {
                this.onEvent(sender, event);
            }
        },
        {
            code: 'delete', name: 'button.delete.label', icon: 'delete', tooltip: 'button.delete.tooltip', 
            needConfirm: true, confirmMessage: 'Are you sure?',
            onEvent: (sender, event) => {
                this.onEvent(sender, event);
            }
        }
    ]
    
    onEvent: (sender: string, event: any) => any = (sender, event) => { };
}