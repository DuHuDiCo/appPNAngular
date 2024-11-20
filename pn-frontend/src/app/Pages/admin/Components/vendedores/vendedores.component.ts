import { AfterViewInit, Component } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import{VendedorService } from 'src/app/Services/Vendedor/vendedor.service';

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.css']
})

export class VendedoresComponent implements AfterViewInit {

  // ARRAY
  vendedoresArray: any[] = []

  constructor(private vendedorService: VendedorService) { }

  ngAfterViewInit(): void {
    this.getVendedores();
  }

  getVendedores(){
    this.vendedorService.getVendedores().pipe(
      tap((data: any) => {
        this.vendedoresArray = data
        console.log(data);
      }), catchError((error: Error) => {
        console.log(error);
        return of([])
      })
    ).subscribe()
  }



}
