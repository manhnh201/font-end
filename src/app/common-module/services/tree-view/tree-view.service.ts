import { Injectable } from '@angular/core';
import { TreeNode } from '../../dto/tree-node';
import { MenuItem } from '../../dto/menu-item';

@Injectable({
  providedIn: 'root'
})
export class TreeViewService {

  constructor() { }

  /**
   * Từ mảng phần tử trả về TreeNode[] dưa trên các giá trị ràng buộc
   * @param item 
   * @param items 
   * @param config 
   * @returns 
   */
  calcTreePath(item: any, items: any[], config: { parentKey: string, pathKey: string } = { parentKey: 'parentId', pathKey: 'code' }) {
    if (!config.parentKey) config.parentKey = 'parentId';
    if (!config.pathKey) config.pathKey = 'code';

    if (item['level'] == undefined) item['level'] = 1;

    if (!item[config.parentKey]) {
      item['path'] = item[config.pathKey];
      return item['path'];
    }
    let parent = items.find((_item: any) => {
      return _item['id'] == item[config.parentKey];
    })
    if (!parent) {
      item['path'] = item[config.pathKey];
      return item['path'];
    }
    if (parent['path']) {
      item['level'] = parent['level'] + 1;
      item['path'] = `${parent['path']}/${item[config.pathKey]}`
      return item['path'];
    }

    item['path'] = `${this.calcTreePath(parent, items, config)}/${item[config.pathKey]}`;
    item['level'] = parent['level'] + 1;
    return item['path'];
  }

  /**
   * Trả về dữ liệu dạng Treeview
   * @param items 
   * @returns 
   */
  getTreeView(items: any[], checkedKeys: string[] = []) {
    items.forEach((item) => {
      this.calcTreePath(item, items);
    })

    let treeView: TreeNode[] = [];

    let lv1Items: any[] = items.filter((item) => {
      return item.level === 1;
    })
    let lv2Items: any[] = items.filter((item) => {
      return item.level === 2;
    })
    let lv3Items: any[] = items.filter((item) => {
      return item.level === 3;
    })
    lv1Items.forEach((lv1Item) => {
      let lv1TreeNode: TreeNode = { name: lv1Item.name, data: lv1Item, title: lv1Item.name, key: lv1Item.code }
      lv1TreeNode.children = lv2Items.filter((lv2Item) => {
        return lv2Item.parentId === lv1Item.id;
      }).map((lv2Item) => {
        let lv2TreeNode: TreeNode = { name: lv2Item.name, data: lv2Item, title: lv2Item.name, key: lv2Item.code }
        lv2TreeNode.children = lv3Items.filter((lv3Item) => {
          return lv3Item.parentId === lv2Item.id;
        }).map((lv3Item) => {
          let lv3TreeNode: TreeNode = { name: lv3Item.name, data: lv3Item, title: lv3Item.name, key: lv3Item.code }
          lv3TreeNode.children = []
          lv3TreeNode.isLeaf = lv3TreeNode.children.length == 0
          //Chỉ đánh dấu check nếu là leaf, trong danh sách checkedKeys
          lv3TreeNode.checked = lv3TreeNode.isLeaf && lv3TreeNode.key != undefined && checkedKeys.includes(lv3TreeNode.key)
          return lv3TreeNode;
        })
        lv2TreeNode.isLeaf = lv2TreeNode.children.length == 0
        //Chỉ đánh dấu check nếu là leaf, trong danh sách checkedKeys
        lv2TreeNode.checked = lv2TreeNode.isLeaf && lv2TreeNode.key != undefined && checkedKeys.includes(lv2TreeNode.key)
        return lv2TreeNode;
      })
      lv1TreeNode.isLeaf = lv1TreeNode.children.length == 0
      //Chỉ đánh dấu check nếu là leaf, trong danh sách checkedKeys
      lv1TreeNode.checked = lv1TreeNode.isLeaf && lv1TreeNode.key != undefined && checkedKeys.includes(lv1TreeNode.key)
      treeView.push(lv1TreeNode);
    })

    return treeView
  }

  /**
   * Xác định các TreeItem đang được select dựa trên key được chọn
   * @param keys 
   * @param treeNodes 
   * @param selectedItems 
   * @returns 
   */
  getTreeData(keys: string[], treeNodes: TreeNode[], selectedItems: any[] = []) {
    treeNodes.forEach((treeNode: TreeNode) => {
      if (treeNode.key && keys?.includes(treeNode.key)) {
        selectedItems.push(treeNode.data);
        if (treeNode.children && treeNode.children.length > 0) {
          let _keys: any[] = treeNode.children.map((item) => { return item.key })
          this.getTreeData(_keys, treeNode.children, selectedItems)
        }
      } else if (treeNode.children && treeNode.children.length > 0) {
        this.getTreeData(keys, treeNode.children, selectedItems)
      }
    })
    return selectedItems;
  }

  /**
   * Trả về dữ liệu dạng Treeview cho Menu
   * @param items 
   * @returns 
   */
  getMenuTree(items: any[], checkedKeys: string[] = []) {
    items.forEach((item) => {
      this.calcTreePath(item, items);
    })

    let treeView: MenuItem[] = [];

    let lv1Items: any[] = items.filter((item) => {
      return item.level === 1;
    })
    let lv2Items: any[] = items.filter((item) => {
      return item.level === 2;
    })
    let lv3Items: any[] = items.filter((item) => {
      return item.level === 3;
    })
    lv1Items.forEach((lv1Item) => {
      let lv1TreeNode: MenuItem = new MenuItem(lv1Item.name, [], lv1Item.icon, lv1Item.href, lv1Item.href.split('?')[0].split('/'), this.parseQueryString(lv1Item.href), [], lv1Item.hide)
      lv1TreeNode.childs = lv2Items.filter((lv2Item) => {
        return lv2Item.parentId == lv1Item.id;
      }).map((lv2Item) => {
        let lv2TreeNode: MenuItem = new MenuItem(lv2Item.name, [], lv2Item.icon, lv2Item.href, lv2Item.href.split('?')[0].split('/'), this.parseQueryString(lv2Item.href), [], lv2Item.hide)
        lv2TreeNode.childs = lv3Items.filter((lv3Item) => {
          return lv3Item.parentId == lv2Item.id;
        }).map((lv3Item) => {
          let lv3TreeNode: MenuItem = new MenuItem(lv3Item.name, [lv3Item.href], lv3Item.icon, lv3Item.href, lv3Item.href.split('?')[0].split('/'), this.parseQueryString(lv3Item.href), [], lv3Item.hide)
          lv3TreeNode.childs = []
          return lv3TreeNode;
        }).sort((a: any, b: any) => {
          return a.title > b.title ? 1 : -1;
        })
        return lv2TreeNode;
      }).sort((a: any, b: any) => {
        return a.title > b.title ? 1 : -1;
      })
      treeView.push(lv1TreeNode);
    })

    return treeView.sort((a: any, b: any) => {
      return a.title > b.title ? 1 : -1;
    })
  }

  private parseQueryString(query: string) {
    var vars = query.split("?");
    if (vars.length == 1) return {};
    vars = vars[1].split("&");
    var query_string: any = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      var key = decodeURIComponent(pair[0]);
      var value = decodeURIComponent(pair[1]);
      // If first entry with this name
      if (query_string[key] === undefined) {
        query_string[key] = decodeURIComponent(value);
        // If second entry with this name
      } else if (typeof query_string[key] === "string") {
        var arr = [query_string[key], decodeURIComponent(value)];
        query_string[key] = arr;
        // If third or later entry with this name
      } else {
        query_string[key].push(decodeURIComponent(value));
      }
    }
    return query_string;
  }
}