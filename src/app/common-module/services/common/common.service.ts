import { Injectable, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';
import { FormField } from '../../dto/form-field.dto';

@Injectable({
	providedIn: 'root'
})
export class CommonService {
	public static wrapInCard: boolean = true;

	private _isLoading: boolean = false;
	public get isLoading(): boolean {
		return this._isLoading;
	}
	private set isLoading(value: boolean) {
		this._isLoading = value;
	}

	public loadingCounter: number = 0;
	public totalRequest: number = 0;
	public loadingContent: string = "Đang xử lý";

	constructor(private modalService: NzModalService, private sanitizer: DomSanitizer) {
		setInterval(() => {
			if (this.totalRequest > 0) {
				this.loadingCounter++;
				this.loadingCounter = this.loadingCounter == 4 ? this.loadingCounter = 0 : this.loadingCounter;
				this.loadingContent = "Đang xử lý"
				for (let i = 0; i < this.loadingCounter; i++) {
					this.loadingContent += ".";
				}
			}
		}, 1000);
	}

	addTotalRequest(count: number = 1) {
		this.totalRequest += count;
		this._isLoading = this.totalRequest > 0;
	}

	addCompletedRequest(count: number = 1) {
		this.totalRequest -= count;
		this.totalRequest = this.totalRequest < 0 ? 0 : this.totalRequest;
		this._isLoading = this.totalRequest > 0;
	}

	clearRequestCount() {
		this.totalRequest = 0;
		this._isLoading = this.totalRequest > 0;
	}

	checkBrowserVer() {

	}

	showConfirmModal(config: {
		title: string,
		refContent: any,
		okCallback: () => any,
		cancelCallback?: () => any
	}) {
		let ref: NzModalRef = this.modalService.confirm({
			nzTitle: config.title,
			nzContent: config.refContent,
			nzMaskClosable: false,
			nzOnOk: () => {
				if (config.okCallback) return config.okCallback();
				return true
			},
			nzOnCancel: () => {
				if (config.cancelCallback) return config.cancelCallback();
				return true
			}
		})
		return ref
	}

	/**
	 * Danh sách Modal đang hiển thị trên giao diện
	 */
	refModalList: any = {};
	/**
	 * Render Modal theo refContent truyền vào
	 * @param config 
	 * @returns 
	 */
	showDetailFormModal(config: {
		title?: string,
		width?: string,
		modalStyle?: any,
		bodyStyle?: any,
		maskClosable?: boolean,
		refContent?: any,
		params?: any,												//Giá trị truyền vào cho các member của Component trong Modal
		buttons?: any[],
		okText?: string,
		formFields?: FormField[],									//Danh sách trường dữ liệu truyền vào Modal
		data?: any,													//Dữ liệu truyền vào Modal
		returnRawData?: boolean,
		okCallback?: (contentComponet: any, data?: any) => any,
		onEvent?: (sender: any, event: any) => any,					//Sự kiện khi thao tác trên Component
	} = {}) {
		if (config.width == undefined) config.width = '50%';

		let refUuid = uuidv4().toLocaleLowerCase();

		let ref: NzModalRef = this.modalService.create({
			nzTitle: config.title,
			nzStyle: config.modalStyle,
			nzContent: config.refContent,
			nzComponentParams: config.params ? config.params : config,
			nzMaskClosable: config.maskClosable === true,
			nzBodyStyle: config.bodyStyle,
			nzWidth: config.width,
			nzFooter: config.buttons,
			nzOkText: config.okText,
			nzOnOk: (): any => {
				if (config.okCallback) {
					let data;
					let refComponent = ref.getContentComponent();
					try {
						data = refComponent.getData()
					} catch (e) {

					}
					return config.okCallback(refComponent, data);
				}
			}
		});

		ref.afterOpen.subscribe({
			next: () => {
				this.refModalList[refUuid] = ref;
			}
		})
		ref.afterClose.subscribe({
			next: () => {
				delete this.refModalList[refUuid];
			}
		})

		return ref;
	}

	closeAllDetailFormModal() {
		Object.entries(this.refModalList).forEach((val: any[], idx, arr) => {
			console.log(`close form with uuid ${val[0]}...`);
			try {
				val[1].close();
			} catch (e) {
				console.error(e);
			}
			delete this.refModalList[val[0]];
		})
	}

	sayswho() {
		var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if (/trident/i.test(M[1])) {
			tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
			return 'IE ' + (tem[1] || '');
		}
		if (M[1] === 'Chrome') {
			tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
			if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
		}
		M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
		if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
		return M.join(' ');
	};

	/**
	 * Tìm kiếm item trong list có giá trị thỏa mãn
	 * @param value 
	 * @param items 
	 * @param key : key cần so sánh của items
	 * @returns 
	 */
	findItem(value: string, items: any[], key: string = 'code') {
		return items.find((item: any) => { return item[key] === value });
	}

	timeOutList: any = {};
	regTimeout(code: string, callback: () => void, timeout: number) {
		clearTimeout(this.timeOutList[code]);
		this.timeOutList[code] = setTimeout(callback, timeout);
	}
	clearTimeout(code: string) {
		clearTimeout(this.timeOutList[code]);
		delete this.timeOutList[code];
	}

	intervalList: any = {};
	regInterval(code: string, callback: () => void, interval: number) {
		clearInterval(this.intervalList[code]);
		this.intervalList[code] = setInterval(callback, interval);
	}
	clearInterval(code: string) {
		clearInterval(this.intervalList[code]);
		delete this.intervalList[code];
	}

	getValue(obj: any, key: string): any {
		if (!obj) {
			return null
		}
		let __keys: string[] = key.split('.')
		if (__keys.length < 2) {
			return obj[key]
		} else {
			let __key = __keys.shift()
			if (__key) {
				return this.getValue(obj[__key], __keys.join('.'))
			}
		}
		return null
	}

	/**
	 * Lưu giá trị vào object
	 * 
	 * {"key1.key2": "val"} chuyển thành {key1: {key2: val}}
	 * @param obj 
	 * @param key
	 * @param value 
	 * @returns 
	 */
	setValue(obj: any, key: string, value: any): any {
		if (!obj) {
			return null
		}
		let __keys: string[] = key.split('.')
		if (__keys.length < 2) {
			if (value !== undefined)
				obj[key] = value
			return obj
		} else {
			let __key = __keys.shift()
			if (__key) {
				obj[__key] = obj[__key] || {}
				return this.setValue(obj[__key], __keys.join('.'), value)
			}
		}
		return null
	}

	/**
	 * Cập nhật giá trị order của phần tử trong mảng
	 * @param dataSet 
	 * @param item 
	 * @param options 
	 * @returns 
	 */
	updateOrder(dataSet: any[], item: any, options: { orderKey: string } = { orderKey: 'ord' }) {
		const newIndex = dataSet.indexOf(item)
		if (newIndex === 0) {
			dataSet[newIndex][options.orderKey] = Math.floor(dataSet[1][options.orderKey] - 1);
		} else if (newIndex === dataSet.length - 1) {
			dataSet[newIndex][options.orderKey] = Math.ceil(dataSet[dataSet.length - 2][options.orderKey] + 1);
		} else {
			let __delta = dataSet[newIndex + 1][options.orderKey] - dataSet[newIndex - 1][options.orderKey]
			let __decimalPlaces = 1
			while (Math.floor(__delta * __decimalPlaces) <= 1) {
				__decimalPlaces *= 10
			}
			dataSet[newIndex].ord = dataSet[newIndex - 1][options.orderKey] + 1 / __decimalPlaces;
		}
		return dataSet
	}
}
