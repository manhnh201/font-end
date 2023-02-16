import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCommonModule } from '../common-module/my-common.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './components/main/main.component';
import { PeriOrderComponent } from './components/peri-order/peri-order.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { OrderListComponent } from './components/order-list/order-list.component';



@NgModule({
  declarations: [
    MainComponent,
    PeriOrderComponent,
    FeedbackComponent,
    OrderListComponent,
  ],
  imports: [
    CommonModule,
    MyCommonModule,
    MainRoutingModule,
  ]
})
export class MainModule { }
