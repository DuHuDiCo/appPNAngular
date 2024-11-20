import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { ProveedorService } from 'src/app/Services/Proveedor/proveedor.service';
import { SaveProveedor } from 'src/Interface/Proveedor.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements AfterViewInit {

  // FORMS
  formProveedor!: FormGroup
  formSearch!: FormGroup

  // ARRAY
  proveedoresArray: any[] = []

  // VARIABLES
  editProveedor: boolean = false
  searchCriteria = { proveedor: '' };

  constructor(private formBuilder: FormBuilder, private proveedorService: ProveedorService, private renderer: Renderer2) {
    this.formProveedor = formBuilder.group({
      "idProveedor": [''],
      "proveedor": ['', [Validators.required]],
      "telefono": ['', [Validators.required]],
      "direccion": ['', [Validators.required]],
      "ciudad": ['', [Validators.required]],
      "banco": ['', [Validators.required]],
      "cuenta": ['', [Validators.required]],
      "email": ['', [Validators.required, Validators.email]],
    });

    this.formSearch = formBuilder.group({
      "dato": ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.getProveedores()
  }

  getProveedores(){
    this.proveedorService.getProveedores().pipe(
      tap((data: any) => {
        this.proveedoresArray = data
        console.log(data);
      }), catchError((error: Error) => {
        console.log(error);
        return of([])
      })
    ).subscribe()
  }

  createProveedor(){
    if(this.formProveedor.valid){
      var proveedor: SaveProveedor = this.formProveedor.value
      console.log(proveedor);
      
      this.proveedorService.saveProveedor(proveedor).pipe(
        tap((data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Proveedor creado',
            text: 'El proveedor ha sido creado exitosamente',
            timer: 3000,
            confirmButtonColor: "#3085d6",
          })
          this.proveedoresArray.push(data)
          this.formProveedor.reset();
          console.log(data);
       }), catchError((error: Error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear el proveedor',
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

  updateProveedor(){
    if(this.formProveedor.valid){
      console.log(this.formProveedor.value);
      
      var Proveedor: SaveProveedor = this.formProveedor.value;
      
      this.proveedorService.editProveedor(Proveedor.idProveedor, Proveedor).pipe(
        tap((data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Proveedor editado',
            text: 'El proveedor ha sido editado exitosamente',
            timer: 3000,
            confirmButtonColor: "#3085d6",
          })
          var pos = this.proveedoresArray.findIndex((p: SaveProveedor) => p.idProveedor === Proveedor.idProveedor);
          this.proveedoresArray[pos] = data;
          this.formProveedor.reset();
          console.log(data);
       }), catchError((error: Error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al editar el proveedor',
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

  getProveedorById(idProveedor: number){
    var proveedor = this.proveedoresArray.find((p: any) => p.idProveedor === idProveedor)
    console.log(proveedor);

    this.formProveedor.patchValue(proveedor!);

    const button = document.getElementById('modalClick');
    if (button) {
      this.editProveedor = true;
      this.renderer.selectRootElement(button).click();
    }
  }

  getBuscarProveedor(dato: string){
    if(dato == ''){
      this.getProveedores();
      return;
    }

    if(this.formSearch.valid){
      this.proveedorService.buscarProveedor(dato).pipe(
        tap((data: any) => {
          this.proveedoresArray = data
          Swal.fire({
            icon: 'success',
            title: 'Proveedores encontrados',
            text: 'Se encontraron estos proveedores',
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
              text: 'Proveedor no encontrado',
              timer: 3000,
              confirmButtonColor: "#3085d6",
            })
            console.log(error);
            return of([])
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al buscar el proveedor',
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
  
  deleteProveedor(idProveedor: number) {
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
        this.proveedorService.deleteProveedor(idProveedor).pipe(
          tap((data: any) => {
            this.proveedoresArray = this.proveedoresArray.filter(
              (p: any) => p.idProveedor !== idProveedor
            );
  
            Swal.fire({
              icon: "success",
              title: "Proveedor eliminado",
              text: "El proveedor ha sido eliminado exitosamente",
              timer: 3000,
              confirmButtonColor: "#3085d6",
            });
  
            console.log(data); 
          }),
          catchError((error: Error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error al eliminar el proveedor",
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
  
  clearProveedor(){
    this.editProveedor = false;
    this.formProveedor.reset();
  }
}
