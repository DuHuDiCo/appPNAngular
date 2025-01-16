import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { ClienteService } from 'src/app/Services/Cliente/cliente.service';
import { PagoClienteService } from 'src/app/Services/Pago-clientes/pago-cliente.service';
import { SaveClient } from 'src/Interface/Client.type';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resumen-cuenta',
  templateUrl: './resumen-cuenta.component.html',
  styleUrls: ['./resumen-cuenta.component.css']
})
export class ResumenCuentaComponent implements OnInit {

  formSearch!: FormGroup;

  cuentasDTOArray: any[] = [];
  clientesArray: SaveClient[] = [];
  isModalOpen = false;
  selectedFactura: any = null;
  avatarColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'];

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private pagoClienteService: PagoClienteService) {
    this.formSearch = formBuilder.group({
      dato: ['', []],
    });
  }

  ngOnInit(): void {
    this.getClientes();
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

  // Función para asignar un color a cada avatar según su índice
  getAvatarColor(index: number): string {
    return this.avatarColors[index % this.avatarColors.length];
  }

  // Método para buscar los pagos de un cliente y mostrarlos
  getPagosClienteById(id: number) {
    if (!id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar un cliente',
        timer: 3000,
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    console.log(this.formSearch.get('dato')?.value);

    this.pagoClienteService
      .obtenerFacturacionesByCliente(id)
      .pipe(
        tap((response: any) => {
          console.log(response);

          // Verifica si cuentaDTOs existe y si esta vacio
          if (!response.cuentaDTOs || response.cuentaDTOs.length === 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Cliente sin pagos',
              timer: 3000,
              confirmButtonColor: '#3085d6',
            });
            this.cuentasDTOArray = [];
            return;
          }

          // Verifica si todos los elementos en cuentaDTOs tienen valor igual a 0
          const noCuotasDisponibles = response.cuentaDTOs.every(
            (cuenta: any) => cuenta.valor === 0
          );

          if (noCuotasDisponibles) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No hay cuotas disponibles',
              timer: 3000,
              confirmButtonColor: '#3085d6',
            });
            this.cuentasDTOArray = [];
            return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Pagos del cliente encontrados',
            text: 'Se encontraron estos pagos',
            timer: 3000,
            confirmButtonColor: '#3085d6',
          });
          this.cuentasDTOArray = response.cuentaDTOs;
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

  // Abrir modal con la información de la factura seleccionada
  openModal(factura: any) {
    this.selectedFactura = factura;
    this.isModalOpen = true;
  }

  // Cerrar modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedFactura = null;
  }

  // Método para resetear la búsqueda
  resetBusqueda() {
    this.formSearch.reset();
    this.cuentasDTOArray = [];
  }
}
