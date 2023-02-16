import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MyCommonModule } from '../common-module/my-common.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';
import { RoleComponent } from './components/role/role.component';
import { CategoryComponent } from './components/category/category.component';
import { ConfComponent } from './components/conf/conf.component';
import { MenuComponent } from './components/menu/menu.component';
import { RequestmapComponent } from './components/requestmap/requestmap.component';
import { LoginComponent } from './components/login/login.component';
import { LoginSsoButtonComponent } from './components/login/login-sso-button/login-sso-button.component';
import { LoginSsoComponent } from './components/login/login-sso/login-sso.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    MyCommonModule,
  ],
  declarations: [
    AdminComponent,
    UserComponent,
    RoleComponent,
    CategoryComponent,
    ConfComponent,
    MenuComponent,
    RequestmapComponent,
    LoginComponent,
    LoginSsoButtonComponent,
    LoginSsoComponent,
  ],
  exports: [
    AdminComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }
