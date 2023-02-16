export class IAction {
    code!: string;
    name!: string;
    icon?: any;
    tooltip?: string;

    /**
     * Action con, thể hiện dạng dropdown
     */
    actions?: IAction[];

    needConfirm?: boolean;
    confirmMessage?: string;

    onEvent: (sender: string, event: IActionEvent) => any = () => { };
}

export interface IActionEvent {
    code?: string;
    value?: any;
}