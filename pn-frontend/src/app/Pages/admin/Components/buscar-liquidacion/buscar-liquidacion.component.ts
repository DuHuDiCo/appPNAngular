import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { LiquidacionService } from 'src/app/Services/Liquidacion/liquidacion.service';
import { UsuarioService } from 'src/app/Services/User/usuario.service';
import { LiquidacionArray } from 'src/Interface/Liquidacion.interface';
import { Usuario } from 'src/Interface/User.type';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buscar-liquidacion',
  templateUrl: './buscar-liquidacion.component.html',
  styleUrls: ['./buscar-liquidacion.component.css'],
})
export class BuscarLiquidacionComponent {
  // FORMS
  formSearch!: FormGroup;

  // ARRAY
  usuariosArray: Usuario[] = [];
  liquidacionesArray: any[] = [];

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

  getLiquidiacionByVendedor(event: any) {
    console.log(this.formSearch.get('dato')?.value);

    this.liquidacionService
      .getLiquidacionByVendedor(this.formSearch.get('dato')?.value)
      .pipe(
        tap((data: any) => {
          console.log(data);
          if (data.length === 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Vendedor sin liquidaciones',
              timer: 3000,
              confirmButtonColor: '#3085d6',
            });
            this.liquidacionesArray = [];
            return;
          }
          Swal.fire({
            icon: 'success',
            title: 'Liquidaciones encontradas',
            text: 'Se encontraron estas facturaciones',
            timer: 3000,
            confirmButtonColor: '#3085d6',
          });
          this.liquidacionesArray = data;
        }),
        catchError((error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al buscar las liquidaciones',
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
