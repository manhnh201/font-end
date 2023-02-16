import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from '../../dto/menu-item';

@Component({
  selector: 'app-menu-sider-item',
  templateUrl: './menu-sider-item.component.html',
  styleUrls: ['./menu-sider-item.component.css']
})
export class MenuSiderItemComponent implements OnInit {
  @Input()
  item: MenuItem = new MenuItem('item');

  constructor() {
  }

  ngOnInit(): void {
  }
}
