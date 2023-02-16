import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { E403Component } from './components/e403/e403.component';


const routes: Routes = [
  { path: '403', component: E403Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExceptionRoutingModule { }
