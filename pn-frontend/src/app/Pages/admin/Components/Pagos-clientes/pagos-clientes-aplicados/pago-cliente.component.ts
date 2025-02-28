import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as e from 'express';
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

  comprobantePreview: string | null = null;
  pagosClienteArray: any[] = [];
  clientesArray: SaveClient[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  isModalOpen: boolean = false;
  isPagoAplicado: boolean = false;
  selectedPago: any = {};


  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private pagoClienteService: PagoClienteService,
  ) {
    this.formSearch = formBuilder.group({
      dato: ['', [Validators.required]],
    });
    this.formPagoCliente = this.formBuilder.group({
      valor: ['', [Validators.required]],
      numeroRecibo: ['', [Validators.required]],
      comprobante: ['', [Validators.required]],
      tipoPago: ['', [Validators.required]],
      aplicarPagoDTO: this.formBuilder.group({
        idCliente: [''],
        fechaPago: [''],
        valor: ['']
      })
    });
  }

  ngOnInit(): void {
    this.getPagosClientes();
    this.getClientes();
  }

  // Metodo para cambiar a los campos de aplicar pago
  togglePago() {
    this.getClientes();
    this.isPagoAplicado = !this.isPagoAplicado;
  }

  // Método para abrir el modal del comprobante de pago de cliente
  openModal(pago: any) {
    this.selectedPago = pago;
    this.isModalOpen = true;
  }

  // Método para cerrar el modal del comprobante de pago de cliente
  closeModal() {
    this.isModalOpen = false;
    this.selectedPago = {};
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

  // Método para seleccionar un archivo y convertirlo a Base64
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.comprobantePreview = reader.result as string;
        this.formPagoCliente.get('comprobante')?.setValue(this.comprobantePreview);
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para abrir el selector de archivos
  selectImage(): void {
    const fileInput = document.getElementById('comprobante') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  }

  // Método para crear un pago de cliente y enviar el formulario
  createPagoCliente(): void {
    const aplicarPagoDTO = this.formPagoCliente.value.aplicarPagoDTO;
    const aplicarPagoDTOs = aplicarPagoDTO.idCliente || aplicarPagoDTO.fechaPago || aplicarPagoDTO.valor
      ? [
        {
          idCliente: aplicarPagoDTO.idCliente ? parseInt(aplicarPagoDTO.idCliente) : null,
          fechaPago: aplicarPagoDTO.fechaPago || null,
          valor: aplicarPagoDTO.valor ? parseInt(aplicarPagoDTO.valor) : null
        }
      ]
      : [];

    const pagoClienteData = {
      idPagoCliente: this.formPagoCliente.value.idPagoCliente,
      valor: parseInt(this.formPagoCliente.value.valor),
      numeroRecibo: this.formPagoCliente.value.numeroRecibo,
      comprobante: this.formPagoCliente.value.comprobante,
      tipoPago: this.formPagoCliente.value.tipoPago,
      aplicarPagoDTO: aplicarPagoDTOs
    };

    console.log(pagoClienteData);

    if (this.formPagoCliente.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos obligatorios',
        timer: 3000,
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.pagoClienteService
      .savePagoCliente(pagoClienteData)
      .pipe(
        tap(() => {
          Swal.fire({
            icon: 'success',
            title: 'Pago guardado exitosamente',
            text: 'El pago se ha guardado correctamente',
            timer: 3000,
            confirmButtonColor: '#3085d6'
          });
          this.formPagoCliente.reset();
          this.comprobantePreview = null;
        }),
        catchError((error) => {
          const errorMessage = error?.error?.message || 'No se pudo crear el pago. Inténtelo nuevamente.';

          Swal.fire({
            icon: 'error',
            title: errorMessage,
            text: 'Hubo un error al guardar el pago',
            timer: 3000,
            confirmButtonColor: '#3085d6'
          });
          console.error(error);
          return of(null);
        })
      )
      .subscribe();
  }

}
