import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, throwError } from 'rxjs';

export const commonToasterInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  return next(req).pipe(
    catchError((error:HttpErrorResponse)=>{
      if (error.status === 200 && error.error.error instanceof SyntaxError) {
             return of(new HttpResponse({ status: 200, body: null }));
      }
      switch (error.status) {
        // case 400: toastr.error('Bad request', 'Error 400'); break;
        // case 401: toastr.warning('Unauthorized. Please log in.', 'Error 401'); break;
        // case 403: toastr.error('Access denied.', 'Error 403'); break;
        // case 404: toastr.error('Resource not found.', 'Error 404'); break;
        // case 500: toastr.error('Server error. Try again later.', 'Error 500'); break;
        default:  toastr.error(error.error);
      }
      console.log(error)
      return throwError(()=>error);
    })
  );
};
