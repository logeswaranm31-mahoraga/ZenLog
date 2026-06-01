import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { commonToasterInterceptor } from '../core/interceptors/common-toaster-interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideToastr({ timeOut: 3000, positionClass: 'toast-top-right' }),
    provideHttpClient(withInterceptors([commonToasterInterceptor]))
  ]
};
