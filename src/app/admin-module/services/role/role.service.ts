import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDomainService } from 'src/app/common-module/services/base-domain/base-domain.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseDomainService {

  domainName: string = "role"

  constructor(http: HttpClient) {
    super(http);
  }

  getAuthorityAvailableForUser(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/api/v1/${this.domainName}/getAuthorityAvailableForUser`)
  }

  getMenuIds(item: any) {
    return this.http
      .get<any>(`${environment.apiUrl}/api/v1/${this.domainName}/${item.id}/menu-ids`);
  }

  updateMenu(item: any, ids: number[]) {
    return this.http
      .put<any>(`${environment.apiUrl}/api/v1/${this.domainName}/${item.id}/update-menu`, ids);
  }

  getModule(item: any) {
    return this.http
      .get<any>(`${environment.apiUrl}/api/v1/${this.domainName}/${item.id}/getModule`);
  }

  updateModule(item: any, ids: number[]) {
    return this.http
      .put<any>(`${environment.apiUrl}/api/v1/${this.domainName}/${item.id}/updateModule`, JSON.stringify(ids));
  }
}
