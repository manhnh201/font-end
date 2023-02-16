import { BaseDomainService } from 'src/app/common-module/services/base-domain/base-domain.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observer } from 'rxjs';
import * as moment from 'moment';
import { MD5 } from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class MainService extends BaseDomainService {
  override prefixApiPath = '/api/v2';
  domainName: string = 'orders/details';

  constructor(http: HttpClient) {
    super(http);
  }

  override loadDataTable(tableFilter: any) {
    let params;
    if(tableFilter.filters) {
      if (Object.keys(tableFilter.filters).length === 0) {
        delete tableFilter.filters
        params = tableFilter;
      } else {
        let filters = tableFilter.filters;
        for (const property in tableFilter.filters) {
          if (property == 'excDate') {
            const start = moment(tableFilter.filters.excDate.value[0]).startOf('day');
            const end = moment(tableFilter.filters.excDate.value[1]).endOf('day')
            filters.excDate.value=[start,end]
          }
        }
        
        params = { ...tableFilter, filters: JSON.stringify(filters) }
      }
    }
    
    return this.http.get<any>(
      `${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}`, { params: params }
    );
  }

  override listV2(params: any = {}, observer?: Partial<Observer<any>>) {
    return this.http
      .get<any>(`${this.env.apiUrl}/${this.domainName}`, { params: params })
      .subscribe(observer);
  }

  generateToken = (apikey:string, transtime:any) =>{
    let data = apikey + transtime;
    let token = MD5(data).toString();
    return token;
  }

  retry(transtime:any, token:any, data: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': token });
    let options = { headers: headers };  
    return this.http
      .post(`${this.env.apiUrl}/api/v1/pushPeriOrder/${transtime}`, data, options)
  }

}
