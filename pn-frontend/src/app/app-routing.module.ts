import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { ModuloAdminComponent } from './Pages/admin/dashboard-admin/modulo-admin/modulo-admin.component';
import { UsuariosComponent } from './Pages/admin/Components/usuarios/usuarios.component';
import { ProveedoresComponent } from './Pages/admin/Components/proveedores/proveedores.component';
import { VendedoresComponent } from './Pages/admin/Components/vendedores/vendedores.component';
import { ClientesComponent } from './Pages/admin/Components/clientes/clientes.component';
import { authGuard } from './Guards/Auth/auth.guard';
import { loginGuard } from './Guards/Login/login.guard';

const routes: Routes = [
  // GENERALES
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },

  // MODULO ADMIN
  { path: 'administracion', redirectTo: 'administracion/usuarios', pathMatch: 'full'},
  {
    path: 'administracion',
    component: ModuloAdminComponent,
    children: [
      { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard] },
      { path: 'proveedores', component: ProveedoresComponent, canActivate: [authGuard] },
      { path: 'vendedores', component: VendedoresComponent, canActivate: [authGuard] },
      { path: 'clientes', component: ClientesComponent, canActivate: [authGuard] },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
