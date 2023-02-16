import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDomainService } from 'src/app/common-module/services/base-domain/base-domain.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService extends BaseDomainService {
  override prefixApiPath = '/api/v2';
  domainName: string = 'comment';
  
  constructor(http: HttpClient) {super(http)}

  override loadDataTable(params: any) {
    let _params = Object.assign({}, params);
    try {
      _params['filters'] = JSON.stringify(_params['filters']);
    } catch (e) {

    }

    return this.http.get<any>(
      `${this.env.feedbackApiUrl}/${this.domainName}`, { params: _params }
    )
  }

}
