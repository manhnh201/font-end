import { Injectable, TemplateRef } from '@angular/core';
import { NzMessageDataOptions, NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private message: NzMessageService) { }

  create(type: 'success' | 'info' | 'warning' | 'error' | 'loading', content: string | TemplateRef<void>, options: NzMessageDataOptions = {}) {
    this.message.create(type, content, options);
  }
}
