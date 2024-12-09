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
import { ClasificacionComponent } from './Pages/admin/Components/clasificacion/clasificacion.component';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { ngxUiLoaderConfig } from 'src/Utils/loaderConfig';
import { LiquidacionComponent } from './Pages/admin/Components/liquidacion/liquidacion.component';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
    }),
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
