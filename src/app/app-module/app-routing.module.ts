import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../admin-module/components/login/login.component';
import { AuthGuard } from '../common-module/guards/auth/auth.guard';
import { environment } from '../../environments/environment';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: environment.defaultRedirect._default ? environment.defaultRedirect._default : 'main' },
  { path: 'login', component: LoginComponent },
  { path: 'exception', loadChildren: () => import('../exception-module/exception.module').then(m => m.ExeptionModule) },
  { path: 'admin', loadChildren: () => import('../admin-module/admin.module').then(m => m.AdminModule), canActivate: [] },
  { path: 'main', loadChildren: () => import('../main-module/main.module').then(m => m.MainModule), canActivate: [AuthGuard] },
  { path: 'map', loadChildren: () => import('../map-module/map.module').then(m => m.MapModule), canActivate: [], },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
