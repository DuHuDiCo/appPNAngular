import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/Auth/login.service';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent {

  constructor(private loginService: LoginService, private router: Router) { }

  logout(){
    this.loginService.logout()
    this.router.navigate([''])
  }
}
