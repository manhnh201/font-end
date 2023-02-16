import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BaseDomainService } from 'src/app/common-module/services/base-domain/base-domain.service';

@Injectable({
  providedIn: 'root'
})
export class ConfService extends BaseDomainService {
  domainName: string = "conf";

  constructor(http: HttpClient) {
    super(http);
  }

  getBrowserVersionRequire() {
    return this.http
      .get<any>(`${this.env.apiUrl}/api/v1/${this.domainName}/getBrowserVersionRequire`);
  }

  getValueByConfigName(name: string) {
    return this.http
      .get<any>(`${this.env.apiUrl}/api/v1/${this.domainName}/getValueByConfigName?name=${name}`);
  }
}
