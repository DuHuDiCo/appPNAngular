import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from 'src/app/Services/Auth/login.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService)
  const router = inject(Router)

  if(!loginService.isLogged()){
    return true
  }
  router.navigate(['administracion'])
  return false;
};
