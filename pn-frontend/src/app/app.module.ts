import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { authInterceptorProviders } from 'src/Interceptor/auth.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { ngxUiLoaderConfig } from 'src/Utils/loaderConfig';
import { AdminModule } from './Pages/admin/dashboard-admin/modulo-admin/admin.module';
import { PagoClienteComponent } from './Pages/admin/Components/Pagos-clientes/pagos-clientes-aplicados/pago-cliente.component';
import { PagosClientesSinAplicarComponent } from './Pages/admin/Components/Pagos-clientes/pagos-clientes-sin-aplicar/pagos-clientes-sin-aplicar.component';
import { ResumenCuentaComponent } from './Pages/admin/Components/Pagos-clientes/resumen-cuenta/resumen-cuenta.component';
import { AplicarPagoClienteManualComponent } from './Pages/admin/Components/Pagos-clientes/aplicar-pago-cliente-manual/aplicar-pago-cliente-manual.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [AppComponent, LoginComponent, PagosClientesSinAplicarComponent, ResumenCuentaComponent, AplicarPagoClienteManualComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    AdminModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule { }
