import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { AppStore } from 'src/app/app.store';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private readonly appStore: AppStore, private readonly router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(({ error, statusText }) => {
        if ([401, 403].includes(error.statusCode)) {
          this.appStore.setAsUnAuthenticated();
          this.router.navigate(['/login']);
        }

        const errorText = error.message || statusText;
        console.error(errorText);
        return throwError(() => errorText);
      }),
    );
  }
}

export const HTTP_ERROR_INTERCEPTOR_PROVIDER = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpErrorInterceptor,
  multi: true,
};
