import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../Services/Auth/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService)
  const router = inject(Router)

  if(loginService.isLogged()){
    return true
  }
  router.navigate([''])
  return false;
};
