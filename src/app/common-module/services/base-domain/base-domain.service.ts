import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LogLevel } from '../../dto/log-level';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseDomainService {
  abstract domainName: string;
  prefixApiPath = '/api/v1';
  env = environment;
  logLevel: LogLevel = LogLevel.INFO;

  constructor(protected http: HttpClient) { }

  /**
   * Sửa dữ liệu trước khi trả ra frontend
   * @param item 
   * @returns 
   */
  analyze(item: any): any {
    let _item = Object.assign({}, item);
    _item.active = _item.active === 1
    _item.enabled = _item.enabled === 1
    return _item;
  }

  /**
   * Sửa dữ liệu trước khi trả về backend
   * @param item 
   * @returns 
   */
  validate(item: any): any {
    let _item = Object.assign({}, item);
    _item.active = (_item.active === true || _item.active === 1) ? 1 : 0;
    _item.enabled = (_item.enabled === true || _item.enabled === 1) ? 1 : 0;
    return _item;
  }

  list(params: any = {}): Observable<any> {
    return this.http
      .get<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}`, { params: params });
  }

  listV2(params: any = {}, observer?: Partial<Observer<any>>) {
    return this.http.get<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}`, { params: params }).subscribe(observer);
  }

  create(item: any): any {
    item.id = undefined;
    item.version = undefined;
    return this.http
      .post<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}`, item);
  }

  createV2(item: any, observer?: Partial<Observer<any>>) {
    item.id = undefined;
    item.version = undefined;
    this.http.post<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}`, item).subscribe(observer);
  }

  saveV2(item: any, observer?: Partial<Observer<any>>) {
    this.createV2(item, observer);
  }

  get(id: any): Observable<any> {
    return this.http
      .get<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}/${id}`);
  }

  getV2(id: any, observer?: Partial<Observer<any>>) {
    return this.http
      .get<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}/${id}`).subscribe(observer);
  }

  update(item: any): Observable<any> {
    item.version = undefined;
    return this.http
      .put<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}/${item.id}`, item);
  }

  updateV2(item: any, observer?: Partial<Observer<any>>) {
    item.version = undefined;
    return this.http.put<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}/${item.id}`, item).subscribe(observer);
  }

  deleteV2(id: any, observer?: Partial<Observer<any>>) {
    this.http.delete<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}/${id}`).subscribe(observer);
  }

  delete(id: any): Observable<any> {
    return this.http
      .delete<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}/${id}`);
  }

  deleteIdInList(ids: string[]): any {
    return this.http
      .delete<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}/deleteIdInList`, { params: { ids: ids } });
  }

  inActiveIdInList(ids: string[], observer?: Partial<Observer<any>>) {
    return this.http.delete<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}/inActiveIdInList`, { body: ids }).subscribe(observer);
  }

  loadDataTable(params: any = {}): Observable<any> {
    let _params = Object.assign({}, params);
    try {
      _params['filters'] = JSON.stringify(_params['filters']);
    } catch (e) {

    }
    return this.http
      .get<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}/loadDataTable`, { params: _params });
  }

  loadDataTableV2(params: any = {}, observer?: Partial<Observer<any>>) {
    let _params = Object.assign({}, params);
    try {
      _params['filters'] = JSON.stringify(_params['filters']);
    } catch (e) {

    }
    return this.http.get<any>(`${this.env.apiUrl}${this.prefixApiPath}/${this.domainName}/loadDataTable`, { params: _params }).subscribe(observer);
  }
}
