import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { Login } from 'src/Interface/User.type';
import Swal from 'sweetalert2';

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
      "username": ['', [Validators.required, Validators.email]],
      "password": ['', [Validators.required]],
    });
   }

  login() {
    if(this.formLogin.valid){
      var credenciales: Login = this.formLogin.value
      this.loginService.inicioSesion(credenciales).pipe(
        tap((data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Bienvenido',
            text: 'Usuario Autenticado',
            timer: 3000,
            confirmButtonColor: "#3085d6",
          })
          this.loginService.setToken(data.token)
          this.loginService.setFecha(data.lastSesion)
          console.log(data);
          setTimeout(() => {
            this.router.navigate(['administracion']);
          }, 1000); 
       }), catchError((error: Error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al ingresar',
            timer: 3000,
            confirmButtonColor: "#3085d6",
          })
          console.log(error);
          return of([])
        })
      ).subscribe()
    }
  }

}
