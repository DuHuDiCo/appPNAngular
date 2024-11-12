import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { ModuloAdminComponent } from './Pages/admin/dashboard-admin/modulo-admin/modulo-admin.component';
import { UsuariosComponent } from './Pages/admin/Components/usuarios/usuarios.component';
import { ProveedoresComponent } from './Pages/admin/Components/proveedores/proveedores.component';
import { VendedoresComponent } from './Pages/admin/Components/vendedores/vendedores.component';

const routes: Routes = [
  // GENERALES
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },

  // MODULO ADMIN
  { path: 'administracion', redirectTo: 'administracion/usuarios', pathMatch: 'full' },
  {
    path: 'administracion',
    component: ModuloAdminComponent,
    children: [
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'vendedores', component: VendedoresComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
