import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MenuService } from '../admin-module/services/menu/menu.service';
import { UserService } from '../admin-module/services/user/user.service';
import { AuthService } from '../common-module/services/auth/auth.service';
import { CommonService } from '../common-module/services/common/common.service';
import { NotificationService } from '../common-module/services/notification/notification.service';
import { RouteService } from '../common-module/services/route/route.service';
import { TranslateImplService } from '../common-module/services/translate/translate.service';
import { TreeViewService } from '../common-module/services/tree-view/tree-view.service';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketEventEnum } from 'src/app/ws-module/service/websocket/i-ws.adapter';
import { SocketIOAdapter } from '../ws-module/service/websocket/socker-io.adapter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private uuid = uuidv4().toLocaleLowerCase();

  public static wrapInCard: boolean = true

  isCollapsed = false;

  env: any = environment;
  hasBreadcrumb = false;

  drawerVisible = false;

  AppComponentSenderEnum = AppComponentSenderEnum

  constructor(private routeService: RouteService,
    private treeViewService: TreeViewService,
    public commonService: CommonService,
    public authService: AuthService,
    public menuService: MenuService,
    private userService: UserService,
    private message: NotificationService,
    private translate: TranslateImplService,
    private socketIOAdapter: SocketIOAdapter) {

    this.hasBreadcrumb = this.env.hasBreadcrumb;
  }

  ngOnDestroy(): void {
    this.socketIOAdapter.unSubcribeEvent(this.uuid)
  }

  ngOnInit(): void {
    this.socketIOAdapter.subcribeEvent(this.uuid, (sender, event) => {
      this.__onEvent(sender, event)
    })

    this.translate.get(this.env.applicationName, {
      next: (resp: any) => {
        document.title = resp;
      }
    });

    if (this.env.serverSideMenu) {
      this.menuService.menuItems = [];
      this.commonService.addTotalRequest();
      this.userService.menu({}).subscribe({
        next: (resp: any) => {
          this.commonService.addCompletedRequest();
          resp.value = resp.value.map((item: any) => {
            return this.menuService.analyze(item);
          })
          let hrefs = resp.value.map((item: any) => { return item.href })
          this.menuService.setAvailableMenus(hrefs);
          this.menuService.menuItems = this.treeViewService.getMenuTree(resp.value);

          if (this.hasBreadcrumb) {
            this.menuService.filterMenus(this.menuService.menuItems, hrefs);
            for (let idx = 0; idx < this.menuService.menuItems.length; idx++) {
              let menuItem = this.menuService.menuItems[idx];
              this.menuService.calcBreadcrumb(menuItem);
            }
          }
        }, error: (err: any) => {
          this.commonService.addCompletedRequest();
          this.message.create('error', 'Error', err.error.message || err.message);
        }, complete: () => {
        }
      })
    } else {
      let rtn = this.menuService.filterMenus(this.env.menuItems);
      this.menuService.menuItems = rtn.menuItems;

      let availableMenus: string[] = rtn.availableMenus;
      this.menuService.setAvailableMenus(availableMenus);

      if (this.hasBreadcrumb) {
        for (let idx = 0; idx < this.menuService.menuItems.length; idx++) {
          let menuItem = this.menuService.menuItems[idx];
          this.menuService.calcBreadcrumb(menuItem);
        }
      }

      this.routeService.routerNavigate(this.menuService.getDefaultRoute());
    }
  }

  __onEvent(sender: any, event: any = undefined) {
    switch (sender) {
      case AppComponentSenderEnum.profile:
        this.userService.showUserProfileModal().subscribe({
          next: () => {
            this.message.create('success', 'Thành công', 'Cập nhật thông tin thành công');
          }, error: (err) => {
            this.message.create('error', 'Có lỗi', err.error.message || err.message);
          }
        })
        break;
      case AppComponentSenderEnum.language:
        if (event) {
          this.translate.use(event);
        }
        break;
      case AppComponentSenderEnum.onMenuClick:
        break
      case AppComponentSenderEnum.onMenuItemClick:
        if (event.routerLink.length > 0) {
          this.routeService.routerNavigate(event.routerLink, event.queryParams);
        } else if (event.href) {
          window.open(event.href, '_blank');
        }
        break
      case AppComponentSenderEnum.nzClick:
        break;
      case AppComponentSenderEnum.nzOpenChange:
        if ((event.item.routerLink.length === 1 && event.item.routerLink[0] !== '') || event.item.routerLink.length > 1) {
          this.routeService.routerNavigate(event.item.routerLink, event.item.queryParams);
        } else if (event.href) {
          window.open(event.href, '_blank');
        }
        break;
      case AppComponentSenderEnum.logout:
        this.authService.logout(() => {
          setTimeout(() => {
            location.reload();
          }, 500)
        });
        break;
      case WebSocketEventEnum.data:
        let data: any = event[1]
        switch (event[0]) {
          case WebSocketDataEventEnum.broadcast:
            this.message.create(data['type'], 'Thông báo', data['message'])
            break
          case WebSocketDataEventEnum.control:
            switch (data.type) {
              case 'logout':
                this.__onEvent(AppComponentSenderEnum.logout)
                break
            }
            break
        }
        break
    }
  }

  checkWrapInCard() {
    return AppComponent.wrapInCard
  }
}

enum AppComponentSenderEnum {
  drawerClose = 'AppComponentSenderEnum_drawerClose',
  language = 'AppComponentSenderEnum_language',
  logout = 'AppComponentSenderEnum_logout',
  nzClick = 'AppComponentSenderEnum_nzClick',
  nzOpenChange = 'AppComponentSenderEnum_nzOpenChange',
  onMenuClick = 'AppComponentSenderEnum_onMenuClick',
  onMenuItemClick = 'AppComponentSenderEnum_onMenuItemClick',
  profile = 'AppComponentSenderEnum_profile',
}

enum WebSocketDataEventEnum {
  broadcast = 'broadcast',
  control = 'control'
}
