import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, take, tap } from 'rxjs';
import { AuthenticationTokenService } from 'src/app/core/authentication/authentication-token.service';
import { UsersHttpService } from 'src/clients/dz-dialect-identity-api';
import { AppStore } from '../../app.store';

@Injectable({
  providedIn: 'root',
})
export class UnauthenticatedGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly userAppStore: AppStore,
    private readonly token: AuthenticationTokenService,
    private readonly usersHttpService: UsersHttpService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const accessToken = route.queryParams['access_token'];
    if (accessToken) {
      this.token.setToken(accessToken);

      return this.usersHttpService.getConnectedUser().pipe(
        tap((currentUser) => {
          this.userAppStore.setUser(currentUser);
          this.router.navigate(['/home']);
        }),
        map(() => true),
        catchError(() => {
          this.userAppStore.setAsUnAuthenticated();
          return EMPTY;
        }),
      );
    }

    return this.userAppStore.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      }),
    );
  }
}
