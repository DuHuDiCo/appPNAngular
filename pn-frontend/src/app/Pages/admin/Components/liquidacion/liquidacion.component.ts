import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { LiquidacionService } from 'src/app/Services/Liquidacion/liquidacion.service';
import { UsuarioService } from 'src/app/Services/User/usuario.service';
import { Usuario } from 'src/Interface/User.type';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.css'],
})
export class LiquidacionComponent implements OnInit {
  // FORMS
  formSearch!: FormGroup;

  // ARRAY
  usuariosArray: Usuario[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private liquidacionService: LiquidacionService
  ) {
    this.formSearch = formBuilder.group({
      dato: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios() {
    this.usuarioService
      .getUsers()
      .pipe(
        tap((data: any) => {
          this.usuariosArray = data;
          console.log(data);
        }),
        catchError((error: Error) => {
          console.log(error);
          return of([]);
        })
      )
      .subscribe();
  }

  getInventarioByVendedor(event: any) {
    console.log(this.formSearch.get('dato')?.value);

    this.liquidacionService
      .getInventarioByVendedor(this.formSearch.get('dato')?.value)
      .pipe(
        tap((data: any) => {
          console.log(data);
          if (data.length === 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Vendedor sin facturaciones',
              timer: 3000,
              confirmButtonColor: '#3085d6',
            });
            return;
          }
          Swal.fire({
            icon: 'success',
            title: 'Facturaciones encontradas',
            text: 'Se encontraron estas facturaciones',
            timer: 3000,
            confirmButtonColor: '#3085d6',
          });
        }),
        catchError((error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al buscar la facturacion',
            timer: 3000,
            confirmButtonColor: '#3085d6',
          });
          console.log(error);
          return of([]);
        })
      )
      .subscribe();
  }
}
