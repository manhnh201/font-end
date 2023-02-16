import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseDomainService } from 'src/app/common-module/services/base-domain/base-domain.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseDomainService {
  domainName: string = "category";

  constructor(http: HttpClient) {
    super(http);
  }

  getCategoryDataByCategoryCode(categoryCode: string) {
    return this.http
      .get<any>(`${this.env.apiUrl}/api/v1/${this.domainName}/getCategoryDataByCategoryCode`, { params: { categoryCode: categoryCode } });
  }

  /**
   * 
   * @param params {categoryCode: ???, value: nullable, code: nullable}
   * @returns 
   */
  getCategoryData(params: { categoryCode: string, code?: string }) {
    return this.http
      .get<any>(`${this.env.apiUrl}/api/v1/${this.domainName}/getCategoryData`, { params: params });
  }
}
