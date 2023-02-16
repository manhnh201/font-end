import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './components/admin/admin.component';
import { CategoryComponent } from './components/category/category.component';
import { ConfComponent } from './components/conf/conf.component';
import { LoginSsoComponent } from './components/login/login-sso/login-sso.component';
import { MenuComponent } from './components/menu/menu.component';
import { RequestmapComponent } from './components/requestmap/requestmap.component';
import { RoleComponent } from './components/role/role.component';
import { UserComponent } from './components/user/user.component';
import { AuthGuard } from '../common-module/guards/auth/auth.guard';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'login-sso', component: LoginSsoComponent, canActivate: [AuthGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'conf', component: ConfComponent, canActivate: [AuthGuard] },
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'requestmap', component: RequestmapComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'role', component: RoleComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
