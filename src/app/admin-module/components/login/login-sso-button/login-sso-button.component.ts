import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/common-module/services/auth/auth.service';

@Component({
  selector: 'app-login-sso-button',
  templateUrl: './login-sso-button.component.html',
  styleUrls: ['./login-sso-button.component.css']
})
export class LoginSsoButtonComponent implements OnInit, OnDestroy {
  env: any = environment;
  ssoWdInterval: any;

  constructor(
    private authService: AuthService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    clearInterval(this.ssoWdInterval);
  }

  __onEvent(sender: any, event?: any) {
    switch (sender) {
      case 'sso':
        let __url = `${this.env.oidc.url}/realms/${this.env.oidc.realm}/protocol/openid-connect/auth`;
        __url += `?client_id=${this.env.oidc.clientId}`;
        __url += `&scope=openid profile email phone address`;
        __url += `&response_type=token`;
        __url += `&state=c649c936418b361fec45554fe73169805b683fdd`;
        __url += `&redirect_uri=${window.location.href}?`;
        __url = encodeURI(__url);

        if (this.env.oidc?.popup === true) {
          let __wd = window.open(__url, "_blank", "location=no,titlebar=no,fullscreen=no,menubar=no,toolbar=no,scrollbars=no,status=no,resizable=no,width=350,height=500");
          let regex = /[#&]([\w_]+)=([\w-.]*)/g;

          this.ssoWdInterval = setInterval(() => {
            if (__wd?.closed) {
              clearInterval(this.ssoWdInterval);
            }

            let __location;
            try {
              __location = __wd?.location.toString();
            } catch (e) {

            }

            if (__wd && __location && regex.test(__location.toString())) {
              clearInterval(this.ssoWdInterval);
              __wd.close();
              let matches = [...__location.toString().matchAll(regex)];

              let user: any = {};
              matches.forEach((item: any[]) => {
                user[item[1]] = item[2];
              })
              let rs = this.authService.loginSSO(user);
              if (rs === true) location.reload();
              return;
            }
          }, 200);
        } else {
          let __wd = window.open(__url, '_self')
          let regex = /[#&]([\w_]+)=([\w-.]*)/g;
        }
        break;
    }
  }
}
