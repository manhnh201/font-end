import { v4 as uuidv4 } from 'uuid';

export class MenuItem {
    code?: string = uuidv4().toLocaleLowerCase();
    title?: string;
    icon?: string;
    href?: string;
    childs: MenuItem[] = [];
    routerLink: any[] = [];
    queryParams?: any = {};
    authorities: string[] = [];
    hide?: boolean = false;
    type?: 'menu' | 'divider' = 'menu';

    selected?: boolean = false;
    open?: boolean = false;
    available?: boolean = false;
    parent?: MenuItem;
    breadcrumb?: any[] = [];
    breadcrumbRouterLink?: any[] = [];

    constructor(title: string, childs: MenuItem[] = [], icon: string = '', href: string = '', routerLink: any[] = [], queryParams: any = {}, authorities: string[] = [], hide: boolean = false, type: 'menu' | 'divider' = 'menu') {
        this.title = title?.trim();
        this.childs = childs;
        this.icon = icon?.trim();
        this.href = href?.trim();
        this.routerLink = routerLink;
        this.queryParams = queryParams;
        this.authorities = authorities;
        this.hide = hide;
        this.type = type;
    }
}