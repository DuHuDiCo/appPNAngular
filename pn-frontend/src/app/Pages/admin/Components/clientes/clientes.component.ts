import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { ClienteService } from 'src/app/Services/Cliente/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements AfterViewInit {

  clientesArray: any[] = []

  formCliente!: FormGroup
  formSearch!: FormGroup

  editCliente: boolean = false
  searchCriteria = { cliente: '' };

  constructor(private clienteService: ClienteService, private formBuilder: FormBuilder, private renderer: Renderer2) {

    this.formCliente = formBuilder.group({
      "idClient": [''],
      "name": ['', [Validators.required]],
      "lastname": ['', [Validators.required]],
      "email": ['', [Validators.required, Validators.email]],
      "phone": ['', [Validators.required]],
      "enabled": ['', [Validators.required]],
    });

    this.formSearch = formBuilder.group({
      "dato": ['', [Validators.required]],
    });
   }

  ngAfterViewInit(): void {
    this.getProveedores();
  }

  getProveedores(){
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

  createCliente(){
    if(this.formCliente.valid){
      var cliente: any = this.formCliente.value
      console.log(cliente);
      
      this.clienteService.createCliente(cliente).pipe(
        tap((data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Cliente creado',
            text: 'El cliente ha sido creado exitosamente',
            timer: 3000,
            confirmButtonColor: "#3085d6",
          })
          this.clientesArray.push(data)
          this.formCliente.reset();
          console.log(data);
       }), catchError((error: Error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear el cliente',
            timer: 3000,
            confirmButtonColor: "#3085d6",
          })
          console.log(error);
          return of([])
        })
      ).subscribe()
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Llene todos los campos',
        timer: 3000,
        confirmButtonColor: "#3085d6",
      })
    }
  }

  updateCliente(){
  }
}
