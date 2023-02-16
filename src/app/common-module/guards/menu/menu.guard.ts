import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from 'src/app/admin-module/services/menu/menu.service';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class MenuGuard implements CanActivate {
  constructor(private router: Router, private menuService: MenuService, private commonService: CommonService) {

  }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let menuHref: string = state.url.split('?')[0]
    this.commonService.clearRequestCount();
    let hrefs = this.menuService.getAvailableMenus();
    let _hrefs = hrefs.map((item) => {return item.split('?')[0]})
    if (_hrefs.includes(menuHref)) {
      return true;
    } else {
      console.warn(`${state.url} --> 403`);
      this.router.navigate([environment.defaultRedirect._default ? environment.defaultRedirect._default : 'admin']);
    }

    return true
  }
}
