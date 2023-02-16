import { Component, OnInit } from '@angular/core';
import { DomainBaseComponent } from 'src/app/common-module/components/domain/base/domain.component';
import { BaseDomainConfigTemplate } from 'src/app/common-module/domain/base';
import { TreeNode } from 'src/app/common-module/dto/tree-node';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { NotificationService } from 'src/app/common-module/services/notification/notification.service';
import { RoleConfigTemplate } from '../../domain/role.dto';
import { MenuService } from '../../services/menu/menu.service';
import { RoleService } from '../../services/role/role.service';
import { AppComponent } from 'src/app/app-module/app.component';
import { TreeViewService } from 'src/app/common-module/services/tree-view/tree-view.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent extends DomainBaseComponent implements OnInit {
  override domainConfigTemplate: BaseDomainConfigTemplate = new RoleConfigTemplate();

  checkedKeys: string[] = [];
  treeViewData: TreeNode[] = [];
  selectedItems: any[] = [];

  override domainService: RoleService;

  constructor(commonService: CommonService, private treeViewService: TreeViewService, notification: NotificationService, domainService: RoleService, private menuService: MenuService) {
    super(commonService, notification, domainService);

    AppComponent.wrapInCard = false;

    this.domainService = domainService;
  }

  ngOnInit(): void {
    this.onInit();
  }

  override onEvent(sender: any, event?: any): void {
    switch (sender) {
      case 'onClick':
        if (event.code === 'data') {
          this.treeViewData = [];
          this.commonService.addTotalRequest();
          this.domainService.getMenuIds(event.value).subscribe({
            next: (resp) => {
              let ids: number[] = resp.value;
              this.commonService.addTotalRequest();
              this.menuService.list().subscribe({
                next: (resp) => {
                  this.checkedKeys = resp.filter((item: any) => {
                    return ids.includes(item.id)
                  }).map((item: any) => {
                    return item.code;
                  })

                  this.treeViewData = this.treeViewService.getTreeView(resp, this.checkedKeys);
                },
                complete: () => {
                  this.commonService.addCompletedRequest();
                }
              })
            },
            complete: () => {
              this.commonService.addCompletedRequest();
            }
          })
        }
        break
      case 'updateMenu':
        this.selectedItems = [];
        this.treeViewService.getTreeData(this.checkedKeys, this.treeViewData, this.selectedItems);

        this.commonService.addTotalRequest();
        this.domainService.updateMenu(this.selectedItem, this.selectedItems.map((item) => { return item.id })).subscribe({
          next: (resp: any) => {
            this.notification.create('success', "Success", "Update Menu sucess!")
          },
          error: (err: any) => {
            this.notification.create('error', "Error", "Update Menu failure!")
          },
          complete: () => {
            this.commonService.addCompletedRequest();
          }
        })
        break
    }
    
    super.onEvent(sender, event);
  }
}