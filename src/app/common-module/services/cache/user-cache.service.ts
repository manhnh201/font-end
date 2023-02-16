import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class UserCacheService extends CacheService {

  constructor(private authService: AuthService) {
    super();
  }

  override memorize(key: string, expire: number, closure: () => any) {
    let user = this.authService.currentUserValue;
    key = `${user?.username}_${key}`;
    return super.memorize(key, expire, closure);
  }

  override deleteKeysWithPattern(pattern: string): void {
    let user = this.authService.currentUserValue;
    pattern = `${user?.username}_${pattern}`;
    return super.deleteKeysWithPattern(pattern);
  }

  override get(key: string): any {
    let user = this.authService.currentUserValue;
    key = `${user?.username}_${key}`;
    return super.get(key);
  }
}
