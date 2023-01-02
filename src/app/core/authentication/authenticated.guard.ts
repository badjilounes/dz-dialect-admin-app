import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AppStore } from '../../app.store';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivateChild {
  constructor(private readonly router: Router, private readonly userAppStore: AppStore) {}

  canActivateChild(): Observable<boolean> | boolean {
    return this.userAppStore.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }),
    );
  }
}
