import { Component, OnInit } from '@angular/core';
import { PagoClienteComponent } from '../pagos-clientes-aplicados/pago-cliente.component';
import { PagoClienteService } from 'src/app/Services/Pago-clientes/pago-cliente.service';
import { catchError, of, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagos-clientes-sin-aplicar',
  templateUrl: './pagos-clientes-sin-aplicar.component.html',
  styleUrls: ['./pagos-clientes-sin-aplicar.component.css']
})
export class PagosClientesSinAplicarComponent implements OnInit {

  pagosClientesSinAplicarArray: any[] = [];

  constructor(private pagoClienteService: PagoClienteService) { }

  ngOnInit(): void {
    this.getPagosClientesSinAplicar();
  }

  // Metodo para obtener los pagos de clientes sin aplicar 
  getPagosClientesSinAplicar() {
    this.pagoClienteService.getPagoClienteSinAplicar().pipe(
      tap((data: any) => {
        this.pagosClientesSinAplicarArray = data;
        console.log(data);
      }), catchError((error: Error) => {
        console.log(error);
        return of([])
      })
    ).subscribe()
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
}
