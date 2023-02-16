import { Injectable, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { TableColumn } from '../../dto/table-column';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class RenderTemplateService {

  constructor(private sanitizer: DomSanitizer, private common: CommonService) { }

  genCheckHtmlContent(active: boolean = true, options: { tableColum?: TableColumn } = {}) {
    let content;
    content = active === true ? `<span style="color: green; font-weight: 700">✓</span>` : `<span style="color: red; font-weight: 700">✗</span>`;
    content = this.sanitizer.bypassSecurityTrustHtml(content);
    if (options.tableColum) {
      options.tableColum.tag = 'html';
    }
    return content;
  }

  genIconHtmlContent(icon: string, options: { tableColum?: TableColumn } = {}) {
    let content;
    content = `<span nz-icon nzType="${icon}" nzTheme="outline"></span>`;
    content = this.sanitizer.bypassSecurityTrustHtml(content);
    if (options.tableColum) {
      options.tableColum.tag = 'icon';
    }
    return content;
  }

	/**
	 * Render Component vào viewContainerRef chỉ định
	 * @param viewContainerRef 
	 * @param content 
	 * @param data 
	 */
	renderComponent(viewContainerRef: ViewContainerRef, content?: any, data?: any) {
		let __componentRef: any = viewContainerRef?.createComponent(content, { index: 0 });
		if (__componentRef) _.assign(__componentRef.instance, data);
	}
}
