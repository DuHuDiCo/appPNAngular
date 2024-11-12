import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuloAdminComponent } from './modulo-admin.component';
import { ProveedoresComponent } from '../../Components/proveedores/proveedores.component';
import { VendedoresComponent } from '../../Components/vendedores/vendedores.component';
import { UsuariosComponent } from '../../Components/usuarios/usuarios.component';



@NgModule({
  declarations: [
    ModuloAdminComponent,
    ProveedoresComponent,
    VendedoresComponent,
    UsuariosComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModuloAdminComponent
  ]
})
export class AdminModule { }
