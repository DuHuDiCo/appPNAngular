import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { ClienteService } from 'src/app/Services/Cliente/cliente.service';
import { SaveClient } from 'src/Interface/Client.type';
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
      "enabled": [false],
    });

    this.formSearch = formBuilder.group({
      "dato": ['', [Validators.required]],
    });
   }

  ngAfterViewInit(): void {
    this.getClientes();
  }

  getClientes(){
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
      if(cliente.enabled == null){
        cliente.enabled = false
      }
      console.log(this.formCliente.value);
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
    if(this.formCliente.valid){
      var cliente: any = this.formCliente.value
      
      this.clienteService.updateCliente(cliente.idClient, cliente).pipe(
        tap((data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Cliente actualizado',
            text: 'El cliente ha sido actualizado exitosamente',
            timer: 3000,
            confirmButtonColor: "#3085d6",
          })
          var pos = this.clientesArray.findIndex((c: any) => c.idClient === cliente.idClient);
          this.clientesArray[pos] = data;
          this.formCliente.reset();
          console.log(data);
       }), catchError((error: Error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar el cliente',
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

  getClienteById(idClient: number){
    var user = this.clientesArray.find((u: SaveClient) => u.idClient === idClient);
    console.log(user);

    this.formCliente.patchValue(user!);

    const button = document.getElementById('modalClick');
    if (button) {
      this.editCliente = true;
      this.renderer.selectRootElement(button).click();
    }
  }

  deleteCliente(idClient: number) {
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
        this.clienteService.deleteCliente(idClient).pipe(
          tap((data: any) => {
            this.clientesArray = this.clientesArray.filter(
              (c: any) => c.idClient !== idClient
            );
  
            Swal.fire({
              icon: "success",
              title: "Cliente eliminado",
              text: "El cliente ha sido eliminado exitosamente",
              timer: 3000,
              confirmButtonColor: "#3085d6",
            });
  
            console.log(data); 
          }),
          catchError((error: Error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error al eliminar el cliente",
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

  getBuscarCliente(dato: string) {
    if(dato == ''){
      this.getClientes();
      return;
    }

    if (this.formSearch.valid) {
      this.clienteService.buscarCliente(dato).pipe(
        tap((data: any) => {
          this.clientesArray= data
          Swal.fire({
            icon: 'success',
            title: 'Clientes encontrados',
            text: 'Se encontraron estos clientes',
            timer: 3000,
            confirmButtonColor: "#3085d6",
          })
          console.log(data);
        }),
        catchError((error: any) => {
          if (error.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Cliente no encontrado',
              timer: 3000,
              confirmButtonColor: "#3085d6",
            })
            console.log(error);
            return of([])
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al buscar el cliente',
              timer: 3000,
              confirmButtonColor: "#3085d6",
            })        
            console.log(error);
            return of([])
          }
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

  clearCliente(){
    this.editCliente = false;
    this.formCliente.reset();
  }
}
  