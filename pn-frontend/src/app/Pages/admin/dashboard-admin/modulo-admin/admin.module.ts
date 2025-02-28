import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuloAdminComponent } from './modulo-admin.component';
import { ProveedoresComponent } from '../../Components/proveedores/proveedores.component';
import { UsuariosComponent } from '../../Components/usuarios/usuarios.component';
import { NavbarAdminComponent } from '../../Components/navbar-admin/navbar-admin.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LiquidacionComponent } from '../../Components/liquidacion/liquidacion.component';
import { ClientesComponent } from '../../Components/clientes/clientes.component';
import { ClasificacionComponent } from '../../Components/clasificacion/clasificacion.component';
import { BuscarLiquidacionComponent } from '../../Components/buscar-liquidacion/buscar-liquidacion.component';
import { PagoClienteComponent } from '../../Components/Pagos-clientes/pagos-clientes-aplicados/pago-cliente.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    ModuloAdminComponent,
    ProveedoresComponent,
    UsuariosComponent,
    NavbarAdminComponent,
    LiquidacionComponent,
    ClientesComponent,
    ClasificacionComponent,
    BuscarLiquidacionComponent,
    PagoClienteComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,

  ],
  exports: [ModuloAdminComponent],
})
export class AdminModule { }
