import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCommonModule } from '../common-module/my-common.module';
import { ExceptionRoutingModule } from './exception-routing.module';
import { E403Component } from './components/e403/e403.component';
import { ResultComponent } from './components/result/result.component';

@NgModule({
  declarations: [
    E403Component,
    ResultComponent
  ],
  imports: [
    CommonModule,
    MyCommonModule,
    ExceptionRoutingModule
  ]
})
export class ExeptionModule { }
