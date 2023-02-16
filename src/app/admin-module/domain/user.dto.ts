import { BaseDomainConfigTemplate } from "src/app/common-module/domain/base";
import { FormField } from "src/app/common-module/dto/form-field.dto";
import { TableColumn } from "src/app/common-module/dto/table-column";

export class UserConfigTemplate extends BaseDomainConfigTemplate {
    override detailModalWidth: string = '50%';

    override updateFormFields: FormField[] = [
        {
            code: 'username', name: "Username", span: 12, type: 'text', disabled: true,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'password', name: "Password", span: 12, type: 'password', placeholder: 'Enter password',
            required: false, minLength: 8,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'roles', name: "Roles", span: 12, type: 'select', selectMode: 'multiple',
            required: true,
            options: [],
            onEvent: (sender: any, event: any) => {
                this.onEvent(sender, event);
            }
        },
        {
            code: 'personal.fullName', name: "Fullname", span: 12, type: 'text', placeholder: 'Enter fullname',
            required: true, minLength: 3,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'personal.email', name: "Email", span: 12, type: 'email', placeholder: 'Enter email',
            required: false, minLength: 8,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        { code: 'personal.dob', name: "DOB", span: 12, type: 'datePicker', onEvent: (sender: any, event: any) => { this.onEvent(sender, event); } },
        {
            code: 'personal.gender', name: "Gender", span: 12, type: 'select',
            options: [
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' }
            ],
            onEvent: (sender: any, event: any) => {
                this.onEvent(sender, event);
            }
        },
        { code: 'enabled', name: "Enabled", span: 12, type: 'switch', onEvent: (sender: any, event: any) => { this.onEvent(sender, event); } },
    ];

    override createFormFields: FormField[] = [
        {
            code: 'username', name: "Username", span: 12, type: 'text', placeholder: 'Enter username',
            required: true, maxLength: 32,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'password', name: "Password", span: 12, type: 'password', placeholder: 'Enter password',
            required: true, minLength: 8,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'roles', name: "Roles", span: 12, type: 'select', selectMode: 'multiple', placeholder: 'Select roles',
            required: true,
            options: [
            ],
            onEvent: (sender: any, event: any) => {
                this.onEvent(sender, event);
            }
        },
        {
            code: 'personal.fullName', name: "Fullname", span: 12, type: 'text', placeholder: 'Enter fullname',
            required: true, minLength: 3,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        {
            code: 'personal.email', name: "Email", span: 12, type: 'email', placeholder: 'Enter email',
            required: false, minLength: 8,
            onEvent: (sender: any, event: any) => { this.onEvent(sender, event); }
        },
        { code: 'personal.dob', name: "DOB", span: 12, type: 'datePicker', onEvent: (sender: any, event: any) => { this.onEvent(sender, event); } },
        {
            code: 'personal.gender', name: "Gender", span: 12, type: 'select',
            options: [
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' }
            ],
            onEvent: (sender: any, event: any) => {
                this.onEvent(sender, event);
            }
        },
        { code: 'enabled', name: "Enabled", span: 12, type: 'switch', onEvent: (sender: any, event: any) => { this.onEvent(sender, event); } },
    ]

    override tableColumns: TableColumn[] = [
        { code: 'id', name: 'ID', headerStyle: "text-align: center;", width: 'auto-fix', dataStyle: "text-align: center; " },
        {
            code: 'username', name: 'Username', headerStyle: "text-align: center; ", width: '5rem',
            filter: true, matchMode: 'contains'
        },
        { code: 'personal.fullName', name: 'Fullname', headerStyle: "text-align: center", filter: true, matchMode: 'contains' },
        { code: 'personal.email', name: 'Email', headerStyle: "text-align: center", filter: true, matchMode: 'contains' },
        {
            code: 'personal.dob', name: 'DOB', headerStyle: "text-align: center", dataStyle: "text-align: center", width: '7rem',
            filter: true, filterType: 'datePicker', pipe: 'date', pipeFormat: 'YYYY-MM-dd'
        },
        {
            code: 'enabled', name: 'Enabled', headerStyle: "text-align: center", dataStyle: "text-align: center", width: '7rem', tag: 'check'
        },
        {
            code: 'accountExpired', name: 'Acc. Expired', headerStyle: "text-align: center", dataStyle: "text-align: center", width: '7rem', tag: 'check'
        },
        {
            code: 'accountLocked', name: 'Acc. Locked', headerStyle: "text-align: center", dataStyle: "text-align: center", width: '7rem', tag: 'check'
        },
        {
            code: 'passwordExpired', name: 'Pass. Expired', headerStyle: "text-align: center", dataStyle: "text-align: center", width: '7rem', tag: 'check'
        },
    ]
}