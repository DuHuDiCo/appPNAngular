import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { ClasificacionService } from 'src/app/Services/Clasificacion/clasificacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clasificacion',
  templateUrl: './clasificacion.component.html',
  styleUrls: ['./clasificacion.component.css']
})
export class ClasificacionComponent implements AfterViewInit {
  clasificacionArray: any[] = []
  formClasificacion!: FormGroup
  formSearch!: FormGroup

  constructor(private clasificacionService: ClasificacionService, private formBuilder: FormBuilder, private renderer: Renderer2) {
    this.formClasificacion = formBuilder.group({
      "clasificacionProducto": ['', [Validators.required]],
      "isFleteObligatorio": [false],
      "enabled": [false],
    });

    this.formSearch = formBuilder.group({
      "dato": ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.getClasificacion();
  }

  getClasificacion() {
    this.clasificacionService.getClasificacion().pipe(
      tap((data: any) => {
        this.clasificacionArray = data
        console.log(data);
      }), catchError((error: Error) => {
        console.log(error);
        console.log('Error al obtener la clasificación');

        return of([])
      })
    ).subscribe()
  }

  createClasificacion() {
    if (this.formClasificacion.valid) {
      var clasificacion: any = this.formClasificacion.value
      console.log(clasificacion);

      this.clasificacionService.saveClasificacion(clasificacion).pipe(
        tap((data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Clasificación creada',
            text: 'El clasificación ha sido creada exitosamente',
            timer: 3000,
            confirmButtonColor: "#3085d6",
          })
          this.clasificacionArray.push(data)
          this.formClasificacion.reset();
          console.log(data);
        }), catchError((error: Error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear el clasificación',
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

  buscarClasificacion(dato: string) {
    this.clasificacionService.buscarClasificacion(dato).pipe(
      tap((data: any) => {
        this.clasificacionArray = data
        Swal.fire({
          icon: 'success',
          title: 'Clasificaciones encontradas',
          text: 'Se encontraron estos clasificaciones',
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
            text: 'Clasificación no encontrada',
            timer: 3000,
            confirmButtonColor: "#3085d6",
          })
          console.log(error);
          return of([])
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al buscar la clasificación',
            timer: 3000,
            confirmButtonColor: "#3085d6",
          })
          console.log(error);
          return of([])
        }
      })
    ).subscribe()
  }
}
