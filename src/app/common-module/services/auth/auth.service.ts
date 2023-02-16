import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import jwt_decode from "jwt-decode";
import { BaseDomainService } from '../base-domain/base-domain.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { RouteService } from '../route/route.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseDomainService {
  domainName!: string;

  authConfig: any = {
    idleTime: undefined,
    lastTimeActive: undefined,
    remainingTime: undefined,
    authInterval: undefined,
    accessTokenDecoded: undefined,
    needExtendSession: undefined,
    isProcessing: undefined
  }

  private __currentUserStoreKey: string = `${this.env.clientId || ''}_currentUser`

  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public currentUser?: Observable<any>;

  constructor(http: HttpClient, private route: RouteService, private localStorage: LocalStorageService) {
    super(http);

    const mouseMoveEvent$ = new BehaviorSubject<any>({});
    mouseMoveEvent$.pipe(debounceTime(100)).subscribe(data => {
      this.authConfig.lastTimeActive = new Date().getTime() / 1000;
    });
    let ele = document.getElementById('body');
    ['keyup', 'mousemove'].forEach((event: string) => {
      ele?.addEventListener(event, (event: any) => {
        mouseMoveEvent$.next(event);
      })
    })

    this.currentUser = this.currentUserValue;

    this.authConfig.authInterval = setInterval(() => {
      if (this.authConfig.accessTokenDecoded) {
        let currentTime = new Date().getTime() / 1000;
        this.authConfig.remainingTime = this.authConfig.accessTokenDecoded['exp'] - currentTime;
        this.authConfig.idleTime = currentTime - this.authConfig.lastTimeActive;
        this.authConfig.needExtendSession = this.authConfig.remainingTime > 0 && this.authConfig.remainingTime < this.env.REMAINING_TIME_TO_EXTEND_SESSION && this.authConfig.idleTime < this.env.IDLE_TIME_TO_AUTO_LOGOUT;

        if (this.authConfig.needExtendSession && !this.authConfig.isProcessing) {
          this.authConfig.isProcessing = true;
          this.sessionExtend().subscribe({
            next: () => {
              this.authConfig.isProcessing = false;
            },
            error: () => {
              this.authConfig.isProcessing = false;
            },
            complete: () => {
              this.authConfig.isProcessing = false;
            }
          });
        }

        if (this.authConfig.idleTime > this.env.IDLE_TIME_TO_AUTO_LOGOUT || this.authConfig.remainingTime < 0) {
          console.log(`${new Date().getTime}: auto logout...`);
          this.logout(() => {
            this.route.navigateToLogin();
          });
        }
      }
    }, 1000);
  }

  public get currentUserValue(): any {
    if (this.env.authRequired === false) return { roles: [] };
    let rtn = this.localStorage.getItem(this.__currentUserStoreKey);
    if (rtn) {
      try {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(rtn));
        return this.currentUserSubject.value;
      } catch (e) {
        console.error(e);
        return null
      }
    }
  }

  login(username: string, password: string) {
    username = username?.toLowerCase();

    return this.http.post<any>(`${this.env.apiUrl}${this.env.LOGIN_ENPOINT}`, { username: username, password: password, clientId: this.env.clientId })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        this.localStorage.setItem(this.__currentUserStoreKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.authConfig.accessTokenDecoded = jwt_decode(user[this.env.ACCESS_TOKEN_KEY]);

        return user;
      }));
  }

  loginSSO(user: any) {
    let accessTokenDecoded: any = jwt_decode(user[this.env.ACCESS_TOKEN_KEY]);
    if (accessTokenDecoded['azp'] !== this.env.oidc.clientId) return false;
    user['roles'] = accessTokenDecoded['resource_access'] && accessTokenDecoded['resource_access'][this.env.oidc.clientId]?.roles || [];
    user['username'] = accessTokenDecoded['preferred_username'];
    user['iat'] = accessTokenDecoded['iat'];
    user['exp'] = accessTokenDecoded['exp'];
    this.localStorage.setItem(this.__currentUserStoreKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.authConfig.accessTokenDecoded = accessTokenDecoded;
    return true;
  }

  sessionExtend() {
    return this.http.request<any>(this.env.EXTEND_SESSION_METHOD, `${this.env.apiUrl}${this.env.EXTEND_SESSION_ENDPOINT}`).pipe(map(user => {
      console.log(`${new Date().getTime}: auto extend session...`);
      this.localStorage.setItem(this.__currentUserStoreKey, JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.authConfig.accessTokenDecoded = jwt_decode(user[this.env.ACCESS_TOKEN_KEY]);
      return user;
    }));
  }

  logout(successCb: () => any) {
    this.http.get<any>(`${this.env.apiUrl}${this.env.LOGOUT_ENPOINT}`).subscribe({
      next: () => {
        // remove user from local storage to log user out
        this.localStorage.clear(this.env['clientId'] ? new RegExp(`^${this.env['clientId']}_`) : undefined);

        this.authConfig = {};
        this.currentUserSubject.next(null);

        if (successCb) {
          successCb();
        }
      }, error: (reason) => {
        // remove user from local storage to log user out
        this.localStorage.clear(this.env['clientId'] ? new RegExp(`^${this.env['clientId']}_`) : undefined);

        this.authConfig = {};
        this.currentUserSubject.next(null);

        if (successCb) {
          successCb();
        }
      }
    })
  }

  getAccessToken() {
    let currentUser = this.currentUserValue;
    if (currentUser) {
      try {
        this.authConfig.accessTokenDecoded = jwt_decode(currentUser[this.env.ACCESS_TOKEN_KEY]);
        return currentUser[this.env.ACCESS_TOKEN_KEY];
      } catch {
        this.localStorage.removeItem(this.__currentUserStoreKey);
      }
    }
  }

  _lastLoginFlag: Boolean = false
  needLogin(): Boolean {
    if (this.env.authRequired === false) return false;
    if (this._lastLoginFlag === true && this.getAccessToken() === undefined) {
      this.route.navigateToLogin();
    }
    this._lastLoginFlag = this.getAccessToken() !== undefined
    return this.getAccessToken() === undefined;
  }
}
