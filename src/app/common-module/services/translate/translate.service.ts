import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Observer } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslateImplService {
  lang: string = 'en';

  private __langStoreKey = `${environment.clientId}_lang`

  constructor(private cookie: CookieService, private translate: TranslateService, private localStorage: LocalStorageService) {
    let _lang = this.localStorage.getItem(this.__langStoreKey);
    this.lang = _lang === null ? this.lang : _lang;
    this.translate.use(this.lang);
  }

  use(lang: string) {
    this.lang = lang;
    this.localStorage.setItem(this.__langStoreKey, lang);
    this.translate.use(lang);
  }

  get(key: string, observer?: Partial<Observer<any>>) {
    this.translate.get(key).subscribe(observer);
  }
}
