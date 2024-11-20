import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { AdminModule } from './Pages/admin/dashboard-admin/modulo-admin/admin.module';
import { ReactiveFormsModule } from '@angular/forms';
import { authInterceptorProviders } from 'src/Interceptor/auth.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { ClientesComponent } from './Pages/admin/Components/clientes/clientes.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClientesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
