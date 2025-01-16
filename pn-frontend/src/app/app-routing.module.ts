import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { ModuloAdminComponent } from './Pages/admin/dashboard-admin/modulo-admin/modulo-admin.component';
import { UsuariosComponent } from './Pages/admin/Components/usuarios/usuarios.component';
import { ProveedoresComponent } from './Pages/admin/Components/proveedores/proveedores.component';
import { ClientesComponent } from './Pages/admin/Components/clientes/clientes.component';
import { authGuard } from './Guards/Auth/auth.guard';
import { loginGuard } from './Guards/Login/login.guard';
import { ClasificacionComponent } from './Pages/admin/Components/clasificacion/clasificacion.component';
import { LiquidacionComponent } from './Pages/admin/Components/liquidacion/liquidacion.component';
import { BuscarLiquidacionComponent } from './Pages/admin/Components/buscar-liquidacion/buscar-liquidacion.component';
import { PagoClienteComponent } from './Pages/admin/Components/Pagos-clientes/pagos-clientes-aplicados/pago-cliente.component';
import { PagosClientesSinAplicarComponent } from './Pages/admin/Components/Pagos-clientes/pagos-clientes-sin-aplicar/pagos-clientes-sin-aplicar.component';
import { ResumenCuentaComponent } from './Pages/admin/Components/Pagos-clientes/resumen-cuenta/resumen-cuenta.component';
import { AplicarPagoClienteManualComponent } from './Pages/admin/Components/Pagos-clientes/aplicar-pago-cliente-manual/aplicar-pago-cliente-manual.component';

const routes: Routes = [
  // GENERALES
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },

  // MODULO ADMIN
  {
    path: 'administracion',
    redirectTo: 'administracion/usuarios',
    pathMatch: 'full',
  },
  {
    path: 'administracion',
    component: ModuloAdminComponent,
    children: [
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [authGuard],
      },
      {
        path: 'proveedores',
        component: ProveedoresComponent,
        canActivate: [authGuard],
      },
      {
        path: 'clientes',
        component: ClientesComponent,
        canActivate: [authGuard],
      },
      {
        path: 'clasificacion',
        component: ClasificacionComponent,
        canActivate: [authGuard],
      },
      {
        path: 'liquidacion',
        component: LiquidacionComponent,
        canActivate: [authGuard],
      },
      {
        path: 'liquidacionBuscar',
        component: BuscarLiquidacionComponent,
        canActivate: [authGuard],
      },
      {
        path: 'pagoCliente',
        component: PagoClienteComponent,
        canActivate: [authGuard],
      },
      {
        path: 'pagosClientesSinAplicar',
        component: PagosClientesSinAplicarComponent,
        canActivate: [authGuard],
      },
      {
        path: 'resumenCuenta',
        component: ResumenCuentaComponent,
        canActivate: [authGuard],
      },
      {
        path: 'aplicarPagoManual',
        component: AplicarPagoClienteManualComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
