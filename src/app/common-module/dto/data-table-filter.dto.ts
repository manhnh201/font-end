import { IsInt, IsString } from "class-validator"

export class DataTableFilter {
    @IsInt()
    first?: number;

    @IsInt()
    rows?: number;

    filters?: Record<string, Filter>;

    @IsString()
    sortField?: string;

    @IsInt()
    sortOrder?: SortOrder;
}

export interface Filter {
    matchMode: 'equals' | 'not' | 'contains' | 'startsWith' | 'endsWith' | 'inList' | 'notInList' | 'greaterThan' | 'greaterThanOrEquals' | 'lowersThan' | 'lowersThanOrEquals' | 'between';
    value: any;
    dataType?: 'datetime' | 'number' | 'string';
}

export enum SortOrder {
    ASC = 1,
    DESC = -1
}