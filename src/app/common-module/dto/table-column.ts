import { IOption } from "./form-field.dto";

export class TableColumn {
    code!: string;
    name!: string;
    headerHtml?: string;
    /**
     * Format của dữ liệu trong cột
     */
    pipe?: 'text' | 'date';
    pipeFormat?: string;

    tag?: 'a' | 'img' | 'tag' | 'html' | 'check' | 'json' | 'number' | 'icon';

    headerStyle?: string;
    width?: string | 'auto';
    dataStyle?: string;
    matchMode?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'inList' | 'notInList' | 'greaterThan' | 'greaterThanOrEquals' | 'lowersThan' | 'lowersThanOrEquals' | 'between';

    sortOrder?: string | 'ascend' | 'descend' | null;
    /**
     * ['ascend', 'descend', null]
     */
    sortDirections?: any[];

    /**
     * Giá trị thay thế code khi search
     */
    searchCode?: string;

    searchValue?: any;
    filter?: boolean;

    /**
     * Phải chỉ định nếu filter = true
     */
    filterType?: 'text' | 'datePicker' | 'dateRangePicker' | 'select' | FilterTypeEnum;
    /**
     * Chỉ định thứ tự của điều kiện khi sinh câu lệnh truy vấn
     */
    filterOrder?: number;

    /**
     * Nếu true, tự động cắt thời gian
     * Chỉ có hiệu lực với filterType in ['datePicker', 'dateRangePicker']
     * Trường hợp filterType=datePicker, set time thành 23:59:59
     * Trường hợp filterType=dateRangePicker, giá trị from set time thành 00:00:00, giá trị to set time thành 23:59:59
     */
    filterModifyTime?: boolean;

    /**
     * Chỉ định nếu filterType == select
     */
    searchOptions?: IOption[];
    selectSource?: 'api' | 'static';
    selectSourceUrl?: string;
    selectDataKey?: string;
    selectLabelKey?: string | string[];
    selectValueKey?: string;

    /**
     * Thông tin bổ sung để bộ lọc phía backend có thể xử lý khi filter
     */
    dataType?: 'datetime' | 'number' | 'string';

    maxLength?: number;
}

export enum FilterTypeEnum {
    text = 'text',
    datePicker = 'datePicker',
    dateRangePicker = 'dateRangePicker',
    select = 'select'
}