import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseDomainService } from 'src/app/common-module/services/base-domain/base-domain.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryDataService extends BaseDomainService {
  domainName: string = "categoryData";

  constructor(http: HttpClient) {
    super(http);
  }
}
