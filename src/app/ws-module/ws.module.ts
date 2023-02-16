import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCommonModule } from '../common-module/my-common.module';
import { SocketIOAdapter } from './service/websocket/socker-io.adapter';
import { WebSocketUtils } from './service/websocket/web-socket.utils';

@NgModule({
  declarations: [
  ],
  providers: [
    SocketIOAdapter,
    WebSocketUtils,
  ],
  imports: [
    CommonModule,
    MyCommonModule,
  ]
})
export class WSModule {
}
