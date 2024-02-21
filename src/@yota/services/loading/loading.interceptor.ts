import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { YotaLoadingService } from '@yota/services/loading/loading.service';
import { finalize, Observable, take } from 'rxjs';

export const yotaLoadingInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> =>
{
    const yotaLoadingService = inject(YotaLoadingService);
    let handleRequestsAutomatically = false;

    yotaLoadingService.auto$
        .pipe(take(1))
        .subscribe((value) =>
        {
            handleRequestsAutomatically = value;
        });

    // If the Auto mode is turned off, do nothing
    if ( !handleRequestsAutomatically )
    {
        return next(req);
    }

    // Set the loading status to true
    yotaLoadingService._setLoadingStatus(true, req.url);

    return next(req).pipe(
        finalize(() =>
        {
            // Set the status to false if there are any errors or the request is completed
            yotaLoadingService._setLoadingStatus(false, req.url);
        }));
};
