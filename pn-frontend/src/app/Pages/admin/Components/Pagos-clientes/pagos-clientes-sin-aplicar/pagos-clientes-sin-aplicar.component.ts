import { Component, OnInit } from '@angular/core';
import { PagoClienteComponent } from '../pagos-clientes-aplicados/pago-cliente.component';
import { PagoClienteService } from 'src/app/Services/Pago-clientes/pago-cliente.service';
import { catchError, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { SaveClient } from 'src/Interface/Client.type';
import { ClienteService } from 'src/app/Services/Cliente/cliente.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pagos-clientes-sin-aplicar',
  templateUrl: './pagos-clientes-sin-aplicar.component.html',
  styleUrls: ['./pagos-clientes-sin-aplicar.component.css']
})
export class PagosClientesSinAplicarComponent implements OnInit {

  // Formularios
  formPagoCliente!: FormGroup;

  // Arrays
  pagosClientesSinAplicarArray: any[] = [];
  clientesArray: SaveClient[] = [];

  // Modales
  isModalOpen: boolean = false;
  isModalOpenAplicacionAutomatica: boolean = false;
  isModalOpenPagoAutomatico: boolean = false;

  // Variables
  selectedPago: any = {};

  constructor(private pagoClienteService: PagoClienteService,
    private clienteService: ClienteService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.formPagoCliente = this.formBuilder.group({
      idCliente: ['', Validators.required],
      fecha: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPagosClientesSinAplicar();
    this.getClientes();
  }

  aplicarPago(p: any): void {
    const navigationExtras = {
      state: { valor: p.valor }
    };

    this.router.navigate(['/administracion/aplicarPagoManual', p.idPagoCliente], navigationExtras);
    console.log({ valor: p.valor }
    );

  }

  // Metodo para abrir el modal del comp0rbte de pago de cliente
  openModal(pago: any) {
    this.selectedPago = pago;
    this.isModalOpen = true;
  }

  // Metodo para cerrar el modal del comprobante de pago de cliente
  closeModal() {
    this.isModalOpen = false;
    this.selectedPago = {};
  }

  verificarValor(p: any): void {
    console.log('Valor que se envía:', p.valor);
  }

  // Metodo para abrir el modal de la aplicacion de pago automática
  openModalAplicacionAutomatica(pago: any) {
    this.selectedPago = pago;
    this.isModalOpenAplicacionAutomatica = true;
  }

  // Metodo para cerrar el modal del comprobante de pago de cliente
  closeModalAplicionAutomatica() {
    this.isModalOpenAplicacionAutomatica = false;
    this.selectedPago = {};
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

  // Método para obtener los pagos de clientes sin aplicar
  getPagosClientesSinAplicar() {
    this.pagoClienteService.getPagoClienteSinAplicar().pipe(
      tap((data: any) => {
        this.pagosClientesSinAplicarArray = data;
      }),
      catchError((error: Error) => {
        console.error('Error al cargar datos:', error);
        return of([]);
      })
    ).subscribe();
  }

  // Metodo para eliminar un pago de cliente
  deletePagoCliente(idPagoCliente: number) {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.pagoClienteService.detelePagoCliente(idPagoCliente).pipe(
          tap((data: any) => {
            this.pagosClientesSinAplicarArray = this.pagosClientesSinAplicarArray.filter(
              (p: any) => p.idPagoCliente !== idPagoCliente
            );

            Swal.fire({
              icon: "success",
              title: "Pago de cliente eliminado",
              text: "El pago de cliente ha sido eliminado exitosamente",
              timer: 3000,
              confirmButtonColor: "#3085d6",
            });

            console.log(data);
          }),
          catchError((error: Error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error al eliminar el pago de cliente",
              timer: 3000,
              confirmButtonColor: "#3085d6",
            });

            console.error(error);
            return of([]);
          })
        ).subscribe();
      }
    });
  }

  // Metodo para crear la aplicacion de pago automatica
  savePagoClienteAutomatico(): void {
    if (this.formPagoCliente.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'Complete los campos requeridos',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const aplicarPagoDTO = {
      valor: this.selectedPago.valor,
      idCliente: parseInt(this.formPagoCliente.value.idCliente),
      fecha: this.formPagoCliente.value.fecha,
    };

    const pagoCliente = { aplicarPagoDTO: [aplicarPagoDTO] };

    const idPagoCliente = this.selectedPago.idPagoCliente;

    this.pagoClienteService.savePagoClienteAutomatico(pagoCliente, idPagoCliente).pipe(
      tap(() => {
        Swal.fire({
          title: 'Pago aplicado',
          text: 'El pago se ha aplicado con éxito',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
        this.formPagoCliente.reset();
        this.getPagosClientesSinAplicar();
      }),
      catchError((error) => {
        const errorMessage = error?.error?.message || 'No se pudo aplicar el pago. Inténtelo nuevamente.';

        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#3085d6',
        });

        console.error('Error en el backend:', error);
        return of([]);
      })
    ).subscribe();
  }
}
