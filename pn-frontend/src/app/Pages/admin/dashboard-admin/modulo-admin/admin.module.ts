import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuloAdminComponent } from './modulo-admin.component';
import { ProveedoresComponent } from '../../Components/proveedores/proveedores.component';
import { VendedoresComponent } from '../../Components/vendedores/vendedores.component';
import { UsuariosComponent } from '../../Components/usuarios/usuarios.component';
import { NavbarAdminComponent } from '../../Components/navbar-admin/navbar-admin.component';



@NgModule({
  declarations: [
    ModuloAdminComponent,
    ProveedoresComponent,
    VendedoresComponent,
    UsuariosComponent,
    NavbarAdminComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModuloAdminComponent
  ]
})
export class AdminModule { }
