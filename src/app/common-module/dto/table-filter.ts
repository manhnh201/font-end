export class TableFilter {
    first: number = 0;
    rows: number = 10;
    filters: Record<string, Filter> = {};
    sortOrder?: '0' | '1';  //0: desc, 1: asc
    sortField?: string;
    globalSearchParam?: any;
}

export class Filter {
    matchMode!: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'inList' | 'notInList' | 'greaterThan' | 'greaterThanOrEquals' | 'lowersThan' | 'lowersThanOrEquals' | 'between';
    value!: any;
    dataType?: 'datetime' | 'number' | 'string';
    order?: number;
}