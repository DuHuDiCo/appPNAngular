import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { Login } from 'src/Interface/User.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // FORMS
  formLogin!: FormGroup

  constructor(private router: Router, private loginService: LoginService, private formBuilder: FormBuilder) {
    this.formLogin = formBuilder.group({
      "username": ['', [Validators.required]],
      "password": ['', [Validators.required]],
    });
   }

  login() {
    if(this.formLogin.valid){
      var credenciales: Login = this.formLogin.value

      this.loginService.inicioSesion(credenciales).pipe(
        tap((data: any) => {
          console.log(data);
          this.router.navigate(['administracion']);
        }), catchError((error: Error) => {
          console.log(error);
          return of([])
        })
      )
    } else {

    }
  }

}
