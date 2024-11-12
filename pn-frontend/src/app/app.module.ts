import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { VendedoresComponent } from './Pages/admin/Components/vendedores/vendedores.component';
import { UsuariosComponent } from './Pages/admin/Components/usuarios/usuarios.component';
import { ProveedoresComponent } from './Pages/admin/Components/proveedores/proveedores.component';
import { ModuloAdminComponent } from './Pages/admin/dashboard-admin/modulo-admin/modulo-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ModuloAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
