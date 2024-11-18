import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/Services/Auth/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authRequest = request;
    var fecha = this.loginService.getFecha()
    if (fecha != null || fecha != undefined) {
      var fechaActual = new Date()
      var diferencia = fechaActual.getTime() - fecha.getTime()
      var horasPasadas = diferencia / 3600000
      console.log(horasPasadas);
      
      if (horasPasadas >= 10) {
        this.loginService.logout()
        window.location.reload()
      } else {
        const token = this.loginService.getToken();
        console.log(token);
        
        if (token != null) {
          authRequest = authRequest.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          })
        }
      }
    }

    console.log(authRequest);
    
    return next.handle(authRequest);
  }
}

export const authInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
]
