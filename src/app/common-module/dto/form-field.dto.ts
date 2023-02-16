import { TemplateRef } from "@angular/core";
import { IAction, IActionEvent } from "./action.dto";

export class FormField {

    code!: string;
    name?: string;
    labelTooltip?: string;
    labelTooltipHtml?: any;

    placeholder?: string;
    span?: 4 | 6 | 8 | 12 | 16 | 24;
    type!: 'divider' | 'blank' | 'text' | 'textarea' | 'editor' | 'password' | 'email' | 'datePicker' | 'dateRangePicker' | 'number' | 'select' | 'switch' | 'timePicker' | 'upload' | 'checkboxGroup';

    value?: any;
    defaultValue?: any;

    pipe?: 'date' | undefined;

    /**
     * Dùng cho type là text
     */
    trim?: boolean; //Bỏ khoảng trắng 2 đầu

    /**
     * Dùng cho type là upload
     */
    uploadMultiple?: boolean;
    uploadSize?: number;    //Dung lượng file tối đa (KB)
    uploadFileType?: string;
    uploadListType?: 'text' | 'picture' | 'picture-card';   //Cách thức thể hiện file được chọn
    uploadType?: 'drag';    //Cách thao tác để upload file

    /**
     * Dùng cho type là password
     */
    passwordVisible?: boolean;

    /**
     * Dùng cho type là datePicker, dateRangePicker 
     */
    datePickerMode?: 'date' | 'week' | 'month' | 'year';
    dataPickerShowTime?: boolean;

    /**
     * Dùng cho type là number
     */
    min?: Number;
    max?: Number;
    step?: Number;

    /**
     * Dùng cho type là select
     */
    //  Array<{ label: string | number | TemplateRef<any>; value: any; disabled?: boolean; hide?: boolean; groupLabel?: string | TemplateRef<any>;}>
    options?: IOption[] = [];
    selectMode?: 'default' | 'multiple' | 'tags' = 'default';
    isLoading?: Boolean;
    selectSource?: 'api' | 'static' = 'static';
    selectSourceUrl?: string;
    selectDataKey?: string;
    selectLabelKey?: string | string[];
    selectValueKey?: string;
    startsWith?: string;
    serverSearch?: boolean;

    /**
     * Dùng cho type là textarea
     */
    rows?: Number;

    disabled?: Boolean = false;

    /**
     * Thuộc tính validator
     */
    required?: Boolean = false;
    pattern?: string;
    patternError?: string;
    maxLength?: number;
    minLength?: number;
    errorTip?: String;

    /**
     * Preview nội dung
     */
    tryPreview?: boolean = false;
    resourceType?: 'img' | 'video' | 'web' | 'json';
    previewStyle?: string;

    inVisible?: boolean;

    onEvent?: (sender: string, event: IActionEvent) => any = (sender, event) => { };

    actions?: IAction[];
}

export interface IOption {
    label: string;
    value: any;
    disabled?: boolean;
    hide?: boolean;
    groupLabel?: string | TemplateRef<any>;
}