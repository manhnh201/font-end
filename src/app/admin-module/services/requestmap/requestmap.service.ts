import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseDomainService } from 'src/app/common-module/services/base-domain/base-domain.service';

@Injectable({
  providedIn: 'root'
})
export class RequestmapService extends BaseDomainService {

  domainName: string = "requestmap"

  constructor(http: HttpClient) {
    super(http);
  }

  override analyze(item: any) {
    let _item: any = Object.assign({}, item)
    _item.configAttributes = _item.configAttributes.split(',');
    return _item;
  }

  override validate(item: any) {
    let _item: any = Object.assign({}, item)
    _item.configAttributes = _item.configAttributes.join(',');
    if (_item.httpMethod instanceof Array) {
      _item.httpMethod = _item.httpMethod[0];
    }
    return _item;
  }
}
