import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { RolesService } from 'src/app/Services/Roles/roles.service';
import { UsuarioService } from 'src/app/Services/User/usuario.service';
import { CreateUser, Permission, Role, Usuario } from 'src/Interface/User.type';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements AfterViewInit {
  // FORMS
  formUser!: FormGroup;
  formVendedor!: FormGroup;

  formSearch!: FormGroup;

  // ARRAY
  usuariosArray: Usuario[] = [];
  rolesArray: Role[] = [];
  permissionsArray: Permission[] = [];

  // VARIABLES
  editUser: boolean = false;
  searchCriteria = { name: '', lastname: '' };

  constructor(
    private usuarioService: UsuarioService,
    private roleService: RolesService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
  ) {
    this.formUser = formBuilder.group({
      idUser: [''],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      enabled: [false],
      isVendedor: [false],
      password: [''],
    });

    this.formVendedor = formBuilder.group({
      porcentaje: ['', [Validators.required, Validators.pattern('')]],
    });

    this.formSearch = formBuilder.group({
      dato: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.getUsuarios();
    this.getPermissions();
    this.getRoles();
  }

  getRoles() {
    this.roleService.getRoles().pipe(
      tap((data: any) => {
        this.rolesArray = data;
        console.log(data);
      }),
      catchError((error: Error) => {
        console.log(error);
        return of([]);
      })
    )
      .subscribe();
  }

  getPermissions() {
    this.roleService.getPermisos().pipe(
      tap((data: any) => {
        this.permissionsArray = data;
        console.log(data);
      }),
      catchError((error: Error) => {
        console.log(error);
        return of([]);
      })
    )
      .subscribe();
  }

  getUsuarios() {
    this.usuarioService
      .getUsers()
      .pipe(
        tap((data: any) => {
          this.usuariosArray = data;
          console.log(data);
        }),
        catchError((error: Error) => {
          console.log(error);
          return of([]);
        })
      )
      .subscribe();
  }

  createUser() {
    if (
      this.formUser.get('isVendedor')?.value == true &&
      !this.formVendedor.valid
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Agregue el porcentaje de liquidación',
        timer: 3000,
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (this.formUser.valid) {
      var user: CreateUser = this.formUser.value;

      if (user.enabled == null) {
        user.enabled = false;
      }

      if (this.formUser.get('isVendedor')?.value == true) {
        user.roles = [
          {
            role: 2,
            permissions: [],
          },
        ];
      } else {
        user.roles = [
          {
            role: 1,
            permissions: [],
          },
        ];
      }

      console.log('Usuario enviado al backend:', user);

      this.usuarioService
        .saveUser(user)
        .pipe(
          tap((data: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Usuario creado',
              text: 'El usuario ha sido creado exitosamente',
              timer: 3000,
              confirmButtonColor: '#3085d6',
            });
            this.usuariosArray.push(data);
            this.formUser.reset();
            console.log('Respuesta del backend:', data);
          }),
          catchError((error: Error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al crear el usuario',
              timer: 3000,
              confirmButtonColor: '#3085d6',
            });
            console.log('Error al crear usuario:', error);
            return of([]);
          })
        )
        .subscribe();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Llene todos los campos',
        timer: 3000,
        confirmButtonColor: '#3085d6',
      });
    }
  }

  updateUser() {
    if (this.formUser.valid) {
      var user: CreateUser = this.formUser.value;
      user.roles = [];
      console.log(user);

      this.usuarioService
        .editUser(user.idUser, user)
        .pipe(
          tap((data: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Usuario editado',
              text: 'El usuario ha sido editado exitosamente',
              timer: 3000,
              confirmButtonColor: '#3085d6',
            });
            var pos = this.usuariosArray.findIndex(
              (u: Usuario) => u.idUser === data.idUser
            );
            this.usuariosArray[pos] = data;
            this.formUser.reset();
            console.log(data);
          }),
          catchError((error: Error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al editar el usuario',
              timer: 3000,
              confirmButtonColor: '#3085d6',
            });
            console.log(error);
            return of([]);
          })
        )
        .subscribe();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Llene todos los campos',
        timer: 3000,
        confirmButtonColor: '#3085d6',
      });
    }
  }

  getUsuarioById(id: number) {
    var user = this.usuariosArray.find((u: Usuario) => u.idUser === id);
    console.log(user);

    this.formUser.patchValue(user!);

    const button = document.getElementById('modalClick');
    if (button) {
      this.editUser = true;
      this.renderer.selectRootElement(button).click();
    }
  }

  getBuscarUsuario(dato: string) {
    if (dato == '') {
      this.getUsuarios();
      return;
    }

    if (this.formSearch.valid) {
      this.usuarioService
        .buscarUsuario(dato)
        .pipe(
          tap((data: any) => {
            this.usuariosArray = data;
            Swal.fire({
              icon: 'success',
              title: 'Usuarios encontrados',
              text: 'Se encontraron estos usuarios',
              timer: 3000,
              confirmButtonColor: '#3085d6',
            });
            console.log(data);
          }),
          catchError((error: any) => {
            if (error.status === 400) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Usuario no encontrado',
                timer: 3000,
                confirmButtonColor: '#3085d6',
              });
              console.log(error);
              return of([]);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al buscar el usuario',
                timer: 3000,
                confirmButtonColor: '#3085d6',
              });
              console.log(error);
              return of([]);
            }
          })
        )
        .subscribe();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Llene todos los campos',
        timer: 3000,
        confirmButtonColor: '#3085d6',
      });
    }
  }

  clearUser() {
    this.editUser = false;
    this.formUser.reset();
  }
}
