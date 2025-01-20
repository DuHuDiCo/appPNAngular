import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { ClienteService } from 'src/app/Services/Cliente/cliente.service';
import { PagoClienteService } from 'src/app/Services/Pago-clientes/pago-cliente.service';
import { SaveClient } from 'src/Interface/Client.type';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aplicar-pago-cliente-manual',
  templateUrl: './aplicar-pago-cliente-manual.component.html',
  styleUrls: ['./aplicar-pago-cliente-manual.component.css']
})
export class AplicarPagoClienteManualComponent implements OnInit {

  // Formularios
  formSearch!: FormGroup;
  formAbono!: FormGroup;

  // Variables
  valorPagoCliente: number | null = null;
  idPagoCliente: number | null = null;

  totalSaldo: number = 0;
  totalPago: number = 0;

  // Arrays
  clientesArray: SaveClient[] = [];
  pagosClienteArray: any[] = [];
  selectedFactura: any = null;
  cuentasDTOArray: any[] = [];
  cuotasSelected: any[] = [];

  // Modal
  isModalOpen = false;

  // Avatares
  avatarColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'];

  constructor(private clienteService: ClienteService,
    private pagoClienteService: PagoClienteService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    this.formSearch = formBuilder.group({
      dato: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getClientes();
    this.route.paramMap.subscribe((params) => {
      this.idPagoCliente = Number(params.get('idPagoCliente'));
      console.log('ID Pago Cliente:', this.idPagoCliente);
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && 'valor' in navigation.extras.state) {
      this.valorPagoCliente = navigation.extras.state['valor'];
      console.log('Valor del pago del cliente:', this.valorPagoCliente);
    } else {
      console.error('No se recibió el valor del pago del cliente.');
    }
  }

  // Función para asignar un color a cada avatar según su índice
  getAvatarColor(index: number): string {
    return this.avatarColors[index % this.avatarColors.length];
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
    console.log('Cuotas seleccionadas:', this.cuotasSelected);
  }

  // verifica si la cuota ya est seleccionada
  isChecked(idCuota: number): boolean {
    return this.cuotasSelected.some((item) => item.idCuota === idCuota);
  }

  // Agregar y eliminar las cuotas
  onCheckboxChange(event: Event, idCuota: number, idFacturacion: number, saldo: number) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.cuotasSelected.push({ idCuota: idCuota, idFacturacion: idFacturacion, valor: saldo });
    } else {
      this.cuotasSelected = this.cuotasSelected.filter(
        (item) => item.idCuota !== idCuota
      );
    }

    this.totalSaldo = this.cuotasSelected.reduce((acc, item) => acc + item.valor, 0);
    this.totalPago = this.totalSaldo;
    console.log('Cuotas seleccionadas:', this.cuotasSelected);
    console.log('Total saldo:', this.totalSaldo);
  }

  // Manejar el cambio en el valor ingresado
  onTotalPagoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newTotalPago = parseFloat(input.value.replace(/[^\d.-]/g, ''));

    if (!isNaN(newTotalPago) && newTotalPago > 0) {
      this.totalPago = newTotalPago;

      let remainingPago = this.totalPago;
      let cuotasPendientes = [...this.cuotasSelected];

      // Asignar el valor al saldo de cada cuota de forma secuencial
      cuotasPendientes.forEach((cuota, index) => {
        // Si el saldo restante es suficiente para saldar la cuota, se salda completamente
        if (remainingPago >= cuota.valor) {
          cuota.valor = cuota.valor; // La cuota se salda completamente
          remainingPago -= cuota.valor; // Restamos el valor de la cuota al total restante
        } else {
          // Si el saldo restante no es suficiente para saldar la cuota, asignamos el saldo restante
          cuota.valor = remainingPago;
          remainingPago = 0;
        }

        if (remainingPago <= 0) {
          return;
        }
      });

      // Si hay saldo restante que no se ha podido asignar a las cuotas, lo asignamos a la última cuota
      if (remainingPago > 0 && this.cuotasSelected.length > 0) {
        this.cuotasSelected[this.cuotasSelected.length - 1].valor += remainingPago;
      }

      console.log('Cuotas actualizadas:', this.cuotasSelected);
      console.log('Total restante:', remainingPago);
    }
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

  // Método para crear abono de un poco de cliente
  createAbono() {
    if (this.cuotasSelected.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar al menos una cuota para guardar el abono.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const abono = {
      idCliente: parseInt(this.formSearch.value.dato),
      idPagoCliente: this.idPagoCliente,
      cuotas: this.cuotasSelected
    };
    console.log(abono);

    this.pagoClienteService.saveAbono(abono).pipe(
      tap(() => {
        Swal.fire({
          title: 'Abono creado',
          text: 'El abono se ha creado con éxito',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
        this.formSearch.reset();
        this.router.navigate(['/administracion/pagosClientes']);
      }),
      catchError((error) => {
        const errorMessage = error?.error?.message || 'No se pudo crear el abono. Inténtelo nuevamente.';
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

  // Verifica si el botón debe estar habilitado
  isButtonDisabled(): boolean {
    return this.cuotasSelected.length === 0;
  }
}
