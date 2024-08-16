import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const logGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).isAuthenticated() ? inject(Router).createUrlTree(["/todos"]) : true ;
};
