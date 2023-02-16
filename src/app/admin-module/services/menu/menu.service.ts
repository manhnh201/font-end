import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LogLevel } from 'src/app/common-module/dto/log-level';
import { MenuItem } from 'src/app/common-module/dto/menu-item';
import { AuthService } from 'src/app/common-module/services/auth/auth.service';
import { BaseDomainService } from 'src/app/common-module/services/base-domain/base-domain.service';
import { LocalStorageService } from 'src/app/common-module/services/local-storage/local-storage.service';
import { RouteService } from 'src/app/common-module/services/route/route.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends BaseDomainService {

  domainName: string = "menu";

  avaiableMenus: string[] = [];
  menuItems: MenuItem[] = [];
  selectedMenuItem!: MenuItem;

  private __availableMenusStoreKey: string = `${this.env.clientId || ''}_availableMenus`

  constructor(http: HttpClient, private authService: AuthService, private localStorage: LocalStorageService) {
    super(http);
  }

  override validate(item: any) {
    let _item = Object.assign({}, item);
    if (_item.parentId === '') _item.parentId = 0
    return _item;
  }

  getMenuTree() {
    return this.http.get<any>(`${this.env.apiUrl}/api/v1/${this.domainName}/getMenuTree`);
  }

  setAvailableMenus(menuHrefs: string[]) {
    this.avaiableMenus = menuHrefs;
    this.localStorage.setItem(this.__availableMenusStoreKey, JSON.stringify(menuHrefs));
  }

  /**
   * Tính toán breadcrumb
   * @param menuItem 
   */
  calcBreadcrumb(menuItem: MenuItem) {
    let breadcrumb: any[] = [];
    let breadcrumbRouterLink: any[] = [];

    if (menuItem.parent) {
      breadcrumb = breadcrumb.concat(menuItem.parent.breadcrumb)
      breadcrumb = breadcrumb.concat(menuItem.parent.title)

      breadcrumbRouterLink = breadcrumbRouterLink.concat(menuItem.parent.breadcrumbRouterLink);
      breadcrumbRouterLink.push(menuItem.parent.routerLink);
    }
    menuItem.breadcrumb = breadcrumb;
    menuItem.breadcrumbRouterLink = breadcrumbRouterLink;

    for (let _idx = 0; _idx < menuItem.childs.length; _idx++) {
      let _menuItem: MenuItem = menuItem.childs[_idx];
      this.calcBreadcrumb(_menuItem);
    }
  }

  getMenuItemFromRouterLink(params: { routerLink: string[], menuItems?: MenuItem[], queryParams?: any }) {
    params.menuItems = params.menuItems || this.menuItems;
    params.queryParams = params.queryParams || {};
    let rtn: any = params.menuItems.find((menuItem: MenuItem) => {
      let __match: boolean = menuItem.routerLink.join('/') === params.routerLink.join('/')
      if (!__match) return __match
      Object.keys(menuItem.queryParams || {}).forEach((key: string) => {
        /**
         * Bỏ qua các key sinh bởi RouteService
         */
        if ([RouteService.signAlias, RouteService.transactionTimeAlias, RouteService.fromStateAlias].includes(key)) return
        
        __match &&= menuItem.queryParams[key] == params.queryParams[key]
      })
      return __match;
    })
    if (!rtn) {
      params.menuItems.forEach((_menuItem: MenuItem) => {
        if (!rtn) rtn = this.getMenuItemFromRouterLink({ routerLink: params.routerLink, menuItems: _menuItem.childs, queryParams: params.queryParams });
      })
    }
    this.selectedMenuItem = rtn;
    return rtn;
  }

  getMenuItemFormUrl(url: string, queryParams?: Record<string, any>) {
    let __params = url.split('?')
    let _routerLink = __params[0].split('/');
    _routerLink = _routerLink.filter((item: string) => { return item !== '' });
    return this.getMenuItemFromRouterLink({ routerLink: _routerLink, queryParams: queryParams });
  }

  getAvailableMenus() {
    let rtn = this.localStorage.getItem(this.__availableMenusStoreKey);
    if (rtn) {
      this.avaiableMenus = JSON.parse(rtn);
    }
    return this.avaiableMenus;
  }

  /**
   * Tính toán menu là show hay hide, trả ra menu được phép hiển thị 
   * Dùng cho trường hợp menu offline
   */
  filterMenus(menuItems: MenuItem[], availableMenus: string[] = []) {
    let currentUser = this.authService.currentUserValue;
    let __menuItems: MenuItem[] = [];

    if (!currentUser) return { menuItems: [], availableMenus: [] };;

    for (let idx = 0; idx < menuItems.length; idx++) {
      let menuItem: MenuItem | any = menuItems[idx]
      if (!menuItem.authorities || menuItem.authorities.length == 0) {
        menuItem.available = false;
      } else {
        menuItem.available = menuItem.authorities.filter((item: any) => { return currentUser.roles.includes(item) }).length == 0
      }

      let rtn = this.filterMenus(menuItem.childs, availableMenus);
      menuItem.childs = rtn.menuItems;
      for (let __idx = 0; __idx < menuItem.childs.length; __idx++) {
        let item = menuItem.childs[__idx]
        item.parent = menuItem;
      }
      availableMenus = rtn.availableMenus;

      // Trường hợp hide == true, kiểm tra các menu con, nếu có menu con hide == false thì parent chuyển hide == false
      menuItem.available = menuItem.available && menuItem.childs && menuItem.childs.length == 0

      if (this.logLevel <= LogLevel.DEBUG) console.debug(`${menuItem.title} <-- ${menuItem.available}`)
      if (!menuItem.available) {
        __menuItems.push(menuItem);
        if (menuItem.routerLink.length > 0) {
          availableMenus.push(`/${menuItem.routerLink.join('/')}`);
        }
      }
    }

    return { menuItems: __menuItems, availableMenus: availableMenus };
  }

  getShowMenu(menuItems: MenuItem[]) {
    return menuItems.filter((item: MenuItem) => { return item.hide !== true });
  }

  getDefaultRoute(): any[] | any {
    let currentUser = this.authService.currentUserValue;
    let _defaultRedirect = Object.entries(this.env.defaultRedirect).find((item: any) => {
      return currentUser && currentUser.roles && currentUser.roles.includes(item[0]);
    })
    if (_defaultRedirect === undefined) return [this.env.defaultRedirect._default].flat();
    else return [..._defaultRedirect[1]];
  }
}
