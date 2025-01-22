import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { RolesService } from 'src/app/Services/Roles/roles.service';
import { UsuarioService } from 'src/app/Services/User/usuario.service';
import { CreateUser, Permission, Role, UserRoles, Usuario } from 'src/Interface/User.type';
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
  selectedPermissionIds: number[] = [];
  selectedRoles: { role: number, permissions: number[] }[] = [];

  showPermissionsModal: boolean = false;
  selectedUserPermissions: string[] = [];
  showPermissions = false;
  selectedRoleId: number | null = null;
  vendedorRoleId: number | null = null;
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

  openPermissionsModal(user: any): void {
    this.selectedUserPermissions = user.userRoles.flatMap((userRole: any) => {
      if (userRole?.permission) {
        return userRole.permission.map((perm: any) => perm.permission);
      }
      return [];
    });

    this.showPermissionsModal = true;
  }

  closePermissionsModal(): void {
    this.showPermissionsModal = false;
  }

  togglePermissions() {
    this.showPermissions = !this.showPermissions;
  }

  getRoles(): void {
    this.roleService.getRoles().pipe(
      tap((data: Role[]) => {
        this.rolesArray = data;
        console.log(this.rolesArray);
      }),
      catchError((error: Error) => {
        console.error('Error al obtener los roles:', error);
        return of([]);
      })
    ).subscribe();
  }

  getPermissions() {
    this.roleService.getPermisos().pipe(
      tap((data: Permission[]) => {
        this.permissionsArray = data;
        console.log(data);
      }),
      catchError((error: Error) => {
        console.error('Error al obtener los permisos:', error);
        return of([]);
      })
    ).subscribe();
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

  onRolesChange(roleId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedRoleId = roleId;
      this.showPermissions = true;
      this.selectedPermissionIds = [];

      // Verificar si el rol seleccionado es "vendedor"
      const vendedorRole = this.rolesArray.find((role) => role.idRole === roleId && role.role === 'VENDEDOR');
      this.formUser.patchValue({ isVendedor: !!vendedorRole });
    } else {
      this.selectedRoleId = null;
      this.showPermissions = false;
      this.selectedRoles = this.selectedRoles.filter((role) => role.role !== roleId);

      // Si el rol de vendedor se deselecciona, desactivar el campo
      const vendedorRole = this.rolesArray.find((role) => role.idRole === roleId && role.role === 'VENDEDOR');
      if (vendedorRole) {
        this.formUser.patchValue({ isVendedor: false });
      }
    }
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoles.some(selectedRole => selectedRole.role === roleId);
  }

  // Cuando se cambian los permisos, agregamos o eliminamos los permisos de la lista
  onPermissionChange(permissionId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedPermissionIds.push(permissionId);
    } else {
      this.selectedPermissionIds = this.selectedPermissionIds.filter(id => id !== permissionId);
    }

    console.log(this.selectedPermissionIds);
  }

  // Al hacer clic en el botón Agregar agregamos el rol y sus permisos al array de roles
  addRoleWithPermissions() {
    if (this.selectedRoleId !== null && this.selectedPermissionIds.length > 0) {
      const newRole = {
        role: this.selectedRoleId,
        permissions: [...this.selectedPermissionIds],
      };

      this.selectedRoles.push(newRole);
      console.log('Roles seleccionados:', this.selectedRoles);

      this.selectedPermissionIds = [];
      this.selectedRoleId = null;
      this.showPermissions = false;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, seleccione un rol y al menos un permiso.',
        timer: 3000,
        confirmButtonColor: '#3085d6',
      });
    }
  }

  // Al enviar el formulario formateamos los roles y permisos para enviarlos correctamente
  createUser(): void {
    const isVendedorSelected = this.selectedRoles.some(role => role.role === 2);

    if (isVendedorSelected) {
      this.formUser.get('isVendedor')?.setValue(true);
    } else {
      this.formUser.get('isVendedor')?.setValue(false);
    }

    if (this.formUser.get('isVendedor')?.value === true) {
      if (!this.formVendedor.get('porcentaje')?.valid) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, agregue un porcentaje válido de liquidación.',
          timer: 3000,
          confirmButtonColor: '#3085d6',
        });
        return;
      }
    }

    if (this.formUser.valid) {
      const user: CreateUser = { ...this.formUser.value };

      if (user.enabled == null) {
        user.enabled = false;
      }

      if (this.formUser.get('isVendedor')?.value === true) {
        user.porcentajeLiquidacion = Number(this.formVendedor.get('porcentaje')?.value);
      }

      user.roles = this.selectedRoles.map((role) => ({
        role: role.role,
        permissions: role.permissions,
      }));

      console.log('Usuario enviado al backend:', user);

      this.usuarioService
        .saveUser(user)
        .pipe(
          tap((data) => {
            Swal.fire({
              icon: 'success',
              title: 'Usuario creado',
              text: 'El usuario ha sido creado exitosamente.',
              timer: 3000,
              confirmButtonColor: '#3085d6',
            });
            this.usuariosArray.push(data);
            this.formUser.reset();
            this.formVendedor.reset();
          }),
          catchError((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al crear el usuario.',
              timer: 3000,
              confirmButtonColor: '#3085d6',
            });
            console.error('Error al crear usuario:', error);
            return of([]);
          })
        )
        .subscribe();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, llene todos los campos.',
        timer: 3000,
        confirmButtonColor: '#3085d6',
      });
    }
  }

  updateUser() {
    if (this.formUser.valid) {
      const user: CreateUser = { ...this.formUser.value };

      // Asegúrate de que los roles y permisos estén correctamente formateados
      user.roles = this.selectedRoles.map((role) => ({
        role: role.role,
        permissions: role.permissions,
      }));

      // Verifica si el campo 'enabled' está presente, y si no, asigna 'false'
      if (user.enabled == null) {
        user.enabled = false;
      }

      // Si es vendedor, asegúrate de enviar el porcentaje de liquidación
      if (this.formUser.get('isVendedor')?.value === true) {
        user.porcentajeLiquidacion = Number(this.formVendedor.get('porcentaje')?.value);
      }

      console.log('Usuario enviado al backend:', user);

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

            const pos = this.usuariosArray.findIndex(
              (u: Usuario) => u.idUser === data.idUser
            );
            if (pos !== -1) {
              this.usuariosArray[pos] = data;
            }

            this.formUser.reset();
            this.formVendedor.reset();
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
            return of([]); // Cambiado de [] a un valor adecuado si es necesario
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
    const user = this.usuariosArray.find((u: Usuario) => u.idUser === id);
    console.log(user);

    if (user) {
      // Cargar los roles y permisos
      this.selectedRoles = user.userRoles.map((userRole: UserRoles) => ({
        role: userRole.role.idRole,  // Usar el id del role
        permissions: userRole.permission ? [userRole.permission.idPermission] : [], // Aquí adaptamos el permiso si existe
      }));

      // Agregar un valor temporal para 'isVendedor' si es necesario
      const isVendedor = user.userRoles.some((userRole: UserRoles) => userRole.role.idRole === 2);
      this.formUser.patchValue({
        ...user,
        isVendedor: isVendedor, // Asignar un valor para 'isVendedor' si corresponde
      });

      // Abrir el modal
      const button = document.getElementById('modalClick');
      if (button) {
        this.editUser = true;
        this.renderer.selectRootElement(button).click();
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Usuario no encontrado',
        timer: 3000,
        confirmButtonColor: '#3085d6',
      });
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
