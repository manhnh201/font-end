import { Injectable, TemplateRef } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notification: NzNotificationService) { }

  create(type: 'success' | 'info' | 'warning' | 'error', title: string, content: string, options: any = {}) {
    if (options.nzDuration === undefined) options.nzDuration = 3000;
    switch (type) {
      case 'success':
        this.notification.success(title, content, options);
        break;
      case 'warning':
        this.notification.warning(title, content, options);
        break;
      case 'error':
        this.notification.error(title, content, options);
        break;
      default:
        this.notification.info(title, content, options);
        break;
    }
  }
}
