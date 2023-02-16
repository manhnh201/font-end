import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from 'src/app/admin-module/services/menu/menu.service';
import { AuthService } from '../../services/auth/auth.service';
import { RouteService } from '../../services/route/route.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private route: RouteService, private menuService: MenuService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      this.route.navigateToLogin();
      return false;
    }
    this.menuService.getMenuItemFormUrl(state.url, state.root.queryParams);
    return true;
  }

}
