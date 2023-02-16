import { Injectable } from '@angular/core';
import { Filter, TableFilter } from '../../dto/table-filter';

@Injectable({
	providedIn: 'root'
})
export class ConvertService {

	constructor() { }

	/**
	 * Convert từ đối tượng filter của ant design table sang dạng chuẩn DataTableResponse
	 * @param params 
	 */
	convertAntFilterToTableFilter(params: any): any {
		let tableFilter: TableFilter = new TableFilter();
		tableFilter['rows'] = params['pageSize'];
		tableFilter['first'] = tableFilter.rows * (params['pageIndex'] > 0 ? params['pageIndex'] - 1 : 0);
		params.sort.forEach((item: any) => {
			if (item.value) {
				tableFilter.sortField = item.key;
				tableFilter.sortOrder = item.value === 'ascend' ? '1' : '0'
			}
		})
		tableFilter.filters = {};
		params.filter.forEach((item: any) => {
			if (item.value) {
				if (['globalSearch', 'quickSearch'].includes(item.key)) {
					tableFilter.globalSearchParam = item.value
					return;
				}
				tableFilter.filters[item.key] = {
					matchMode: item.matchMode,
					value: item.value,
					dataType: item.dataType,
					order: item.order
				}
			}
		})
		return tableFilter;
	}

	/**
	 * Convert từ đối tượng TableFilter sang query của Mongo (Feather)
	 * @param tableFilter 
	 * @returns 
	 */
	tableFilter2MongoQuery(tableFilter: TableFilter) {
		let query: any = {};
		if (tableFilter.sortField !== undefined) {
			query['$sort'] = {};
			query['$sort'][tableFilter.sortField] = tableFilter.sortOrder == "1" ? 1 : -1
		}
		if (tableFilter.rows !== undefined) {
			query['$limit'] = tableFilter.rows;
			query['$skip'] = tableFilter.first;
		}
		if (tableFilter.filters) {
			Object.keys(tableFilter.filters).forEach((key: string) => {
				switch (tableFilter.filters[key]['matchMode']) {
					case 'equals':
						query[key] = tableFilter.filters[key]['value'];
						break;
					case 'inList':
						query[key] = JSON.stringify({ '$in': tableFilter.filters[key]['value'] })
						break;
					case 'contains':
						query[key] = `/${tableFilter.filters[key]['value']}/`
						break;
				}
			})
		}
		return query;
	}

	mongoResponse2DataTableResponse(resp: any) {
		let _resp = {
			totalRows: resp.total,
			rows: resp.limit,
			first: resp.skip,
			items: resp.data,
		}
		return _resp;
	}

	object2FormData(item: any) {
		let formData = new FormData();
		Object.keys(item).forEach((key) => {
			if (item[key] instanceof File) {
				formData.append(key, item[key])
			} else if (item[key] instanceof Array && item[key].length === 1 && item[key][0] instanceof File) {
				formData.append(key, item[key][0])
			} else {
				formData.append(key, item[key])
			}
		})
		return formData;
	}
}
