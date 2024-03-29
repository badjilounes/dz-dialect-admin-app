import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, map, shareReplay, tap } from 'rxjs/operators';
import { UserResponseDto, UsersHttpService } from 'src/clients/dz-dialect-identity-api';
import { AuthenticationTokenService } from './core/authentication/authentication-token.service';

export enum AuthenticationStatus {
  AUTHENTICATED,
  UNAUTHENTICATED,
  PENDING,
}

type UserAppStoreState = {
  currentUser: UserResponseDto | undefined;
  authenticationStatus: AuthenticationStatus;
};

@Injectable({
  providedIn: 'root',
})
export class AppStore extends ComponentStore<UserAppStoreState> {
  readonly isAuthenticated$: Observable<boolean> = this.select(
    (state) => state.authenticationStatus,
  ).pipe(
    filter((isAuthenticated) => isAuthenticated !== AuthenticationStatus.PENDING),
    map((isAuthenticated) => isAuthenticated === AuthenticationStatus.AUTHENTICATED),
  );

  readonly user$: Observable<UserResponseDto | undefined> = this.select(
    (state) => state.currentUser,
  );

  readonly isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  readonly isMobileOrTablet$: Observable<boolean> = this.breakpointObserver
    .observe('(max-width: 1023px)')
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  constructor(
    private readonly usersHttpService: UsersHttpService,
    private readonly tokenService: AuthenticationTokenService,
    private readonly breakpointObserver: BreakpointObserver,
  ) {
    super({
      authenticationStatus: AuthenticationStatus.PENDING,
      currentUser: undefined,
    });
  }

  initStore(): void {
    if (this.tokenService.hasToken()) {
      this.usersHttpService
        .getConnectedUser()
        .pipe(
          tap((currentUser) => this.setUser(currentUser)),
          catchError(() => {
            this.setAsUnAuthenticated();
            return EMPTY;
          }),
        )
        .subscribe();
    } else {
      this.patchState(() => ({
        currentUser: undefined,
        authenticationStatus: AuthenticationStatus.UNAUTHENTICATED,
      }));
    }
  }

  setAsUnAuthenticated(): void {
    this.tokenService.clearToken();

    this.patchState(() => ({
      currentUser: undefined,
      authenticationStatus: AuthenticationStatus.UNAUTHENTICATED,
    }));
  }

  setAsAuthenticated(token: string): void {
    this.tokenService.setToken(token);

    this.initStore();
  }

  setUser(currentUser: UserResponseDto): void {
    this.patchState(() => ({
      currentUser,
      authenticationStatus: AuthenticationStatus.AUTHENTICATED,
    }));
  }
}
