import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AnalyticsService } from './analytics.service';

export const AnalyticsInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const analyticsService = inject(AnalyticsService);
  const startTime = Date.now();

  return next(request).pipe(
    tap((event: HttpEvent<any>) => {
      if (event.type === 4) {
        // HttpResponse
        const responseTime = Date.now() - startTime;
        const endpoint = request.url.replace(request.urlWithParams.split('?')[0], '');
        analyticsService.trackApiCall(endpoint, request.method, event.status, responseTime);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const responseTime = Date.now() - startTime;
      const endpoint = request.url.replace(request.urlWithParams.split('?')[0], '');

      // Track API error
      analyticsService.trackApiCall(endpoint, request.method, error.status, responseTime);

      // Track specific error
      analyticsService.trackError('api_error', error.message, error.toString());

      return throwError(() => error);
    })
  );
};
