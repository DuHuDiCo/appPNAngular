import { Component, OnInit } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { PagoClienteService } from 'src/app/Services/Pago-clientes/pago-cliente.service';

@Component({
  selector: 'app-pago-cliente',
  templateUrl: './pago-cliente.component.html',
  styleUrls: ['./pago-cliente.component.css']
})
export class PagoClienteComponent implements OnInit {

  pagosClienteArray: any[] = [];

  constructor(private pagoClienteService: PagoClienteService) { }

  ngOnInit(): void {
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
}
