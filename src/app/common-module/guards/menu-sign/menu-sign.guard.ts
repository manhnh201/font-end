import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteService } from '../../services/route/route.service';

@Injectable({
  providedIn: 'root'
})
export class MenuSignGuard implements CanActivate {
  constructor(private router: Router, private routeService: RouteService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let queryParams: any = state.root.queryParams;

    if (this.routeService.checkSign(queryParams)) {
      return true;
    } else {
      this.routeService.routerNavigate(['']);
      return false;
    }
  }

}
