import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { ClienteService } from 'src/app/Services/Cliente/cliente.service';
import { PagoClienteService } from 'src/app/Services/Pago-clientes/pago-cliente.service';
import { SaveClient } from 'src/Interface/Client.type';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago-cliente',
  templateUrl: './pago-cliente.component.html',
  styleUrls: ['./pago-cliente.component.css']
})
export class PagoClienteComponent implements OnInit {

  formSearch!: FormGroup;
  formPagoCliente!: FormGroup;

  pagosClienteArray: any[] = [];
  clientesArray: SaveClient[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private pagoClienteService: PagoClienteService,
  ) {
    this.formSearch = formBuilder.group({
      dato: ['', [Validators.required]],
    });

    this.formPagoCliente = formBuilder.group({
      idPagoCliente: [''],
      valor: ['', [Validators.required]],
      numeroRecibo: ['', [Validators.required]],
      comprobante: ['', [Validators.required]],
      tipoPago: ['', [Validators.required]],
      aplicarPagoDTO: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.getPagosClientes();
    this.getClientes();
  }

  //Metodo para listar los pagos de clientes
  getPagosClientes() {
    this.pagoClienteService.getPagoCliente().pipe(
      tap((data: any) => {
        this.pagosClienteArray = data
        console.log(data);
      }), catchError((error: Error) => {
        console.log(error);
        return of([])
      })
    ).subscribe()
  }

  //Metodo para listar los clientes
  getClientes() {
    this.clienteService.getClientes().pipe(
      tap((data: any) => {
        this.clientesArray = data
        console.log(data);
      }), catchError((error: Error) => {
        console.log(error);
        return of([])
      })
    ).subscribe()
  }

  // Metodo para buscar los pagos de un cliente
  getPagosClienteById(id: number) {
    console.log(this.formSearch.get('dato')?.value);

    this.pagoClienteService
      .obtenerPagosByCliente(id)
      .pipe(
        tap((data: any) => {
          console.log(data);
          if (data.length === 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Cliente sin pagos',
              timer: 3000,
              confirmButtonColor: '#3085d6',
            });
            this.pagosClienteArray = [];
            return;
          }
          Swal.fire({
            icon: 'success',
            title: 'Pagos del cliente encontrados',
            text: 'Se encontraron estos pagos',
            timer: 3000,
            confirmButtonColor: '#3085d6',
          });
          this.pagosClienteArray = data;
        }),
        catchError((error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al buscar los pagos del cliente',
            timer: 3000,
            confirmButtonColor: '#3085d6',
          });
          console.error(error);
          return of([]);
        })
      )
      .subscribe();
  }

  createPagoCliente() {
    if (this.formPagoCliente.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos obligatorios',
        timer: 3000,
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const pagoClienteData = this.formPagoCliente.value;

    this.pagoClienteService.savePagoCliente(pagoClienteData)
      .pipe(
        tap((response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Pago guardado exitosamente',
            text: 'El pago se ha guardado correctamente',
            timer: 3000,
            confirmButtonColor: '#3085d6',
          });
          // limpiar el formulario
          this.formPagoCliente.reset();
          console.log(response);
        }),
        catchError((error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar el pago',
            timer: 3000,
            confirmButtonColor: '#3085d6',
          });
          console.error(error);
          return of(null);
        })
      )
      .subscribe();
  }

}
