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

  selectedRoleName: string = '';
  showPermissionsModal: boolean = false;
  selectedUserPermissions: string[] = [];
  showPermissions = false;
  showPermissionsEdit = false;
  selectedRoleId: number | null = null;
  vendedorRoleId: number | null = null;
  selectedUser: Usuario | null = null;
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

  // Metodo para abrir el modal de permisos
  openPermissionsModal(user: any): void {
    this.selectedUserPermissions = user.userRoles.flatMap((userRole: any) => {
      if (userRole?.permission) {
        return userRole.permission.map((perm: any) => perm.permission);
      }
      return [];
    });
    this.showPermissionsModal = true;
  }

  // Metodo para cerrar el modal de permisos
  closePermissionsModal(): void {
    this.showPermissionsModal = false;
  }

  // Método para verificar si el rol es 'ADMINISTRADOR'
  isAdminRole(role: any): boolean {
    return role.role === 'ADMINISTRADOR';
  }

  // Metodo para saber si un rol está seleccionado
  isRoleSelected(roleId: number): boolean {
    return this.selectedRoles.some(selectedRole => selectedRole.role === roleId);
  }

  // Método para ver los permisos del rol seleccionado
  onRoleSelect(idRole: number) {
    const selectedRole = this.rolesArray.find(role => role.idRole === idRole);
    if (selectedRole) {
      this.selectedRoleId = idRole;
      this.selectedRoleName = selectedRole.role;

      if (this.selectedUser) {
        const userRole = this.selectedUser.userRoles.find(
          (role: UserRoles) => role.role.idRole === idRole
        );

        if (userRole && userRole.permission) {
          this.selectedPermissionIds = userRole.permission.map((perm: Permission) => perm.idPermission);
        } else {
          this.selectedPermissionIds = [];
        }

        this.showPermissions = true;
        console.log("Rol seleccionado:", this.selectedRoleName);
        console.log("Permisos cargados:", this.selectedPermissionIds);
      } else {
        console.warn("No hay usuario seleccionado.");
      }
    } else {
      console.warn("Rol no encontrado.");
    }
  }

  // Metodo para cargar los permisos al editar
  loadUserPermissions(user: Usuario) {
    console.log("Cargando permisos para el usuario:", user);
    if (this.selectedRoleId !== null) {
      const selectedRole = user.userRoles.find(
        (role: UserRoles) => role.role.idRole === this.selectedRoleId
      );

      console.log("Rol seleccionado:", selectedRole);

      if (selectedRole && selectedRole.permission && selectedRole.permission.length > 0) {
        this.selectedPermissionIds = selectedRole.permission.map((perm: Permission) => perm.idPermission);
        console.log('Permisos cargados desde loadUserPermissions:', this.selectedPermissionIds);
      } else {
        console.log('No se encontraron permisos para este rol o el array está vacío.');
        this.selectedPermissionIds = [];
      }
    }
  }

  // Metodo para obtener el usuario seleccionado
  getSelectedUser(): Usuario | null {
    return this.selectedUser;
  }

  // Metodo para mostrar o ocultar los permisos
  togglePermissions() {
    if (this.selectedUser) {
      if (this.showPermissions) {
        this.showPermissions = false;
        console.log("Volviendo atrás en modo edición");
      } else {
        if (this.selectedRoleId !== null) {
          this.loadUserPermissions(this.selectedUser);
          this.showPermissions = true;
          console.log("Permisos cargados:", this.selectedPermissionIds);
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Sin Rol Seleccionado',
            text: 'Por favor, selecciona un rol antes de ver los permisos.',
            timer: 3000,
            confirmButtonColor: '#3085d6',
          });
        }
      }
    } else {
      this.showPermissions = !this.showPermissions;
    }
  }

  // Metodo para cambiar el estado de un rol
  onRolesChange(roleId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedRoleId = roleId;
      this.selectedPermissionIds = [];

      const isAdminRole = this.rolesArray.find((role) => role.idRole === roleId && role.role === 'ADMINISTRADOR');

      if (isAdminRole) {
        this.selectedRoles.push({
          role: roleId,
          permissions: []
        });
        this.showPermissions = false;
      } else {
        this.showPermissions = true;

        if (this.selectedUser) {
          this.loadUserPermissions(this.selectedUser);
        }
      }
    } else {
      this.selectedRoles = this.selectedRoles.filter(role => role.role !== roleId);
      this.selectedRoleId = null;
      this.showPermissions = false;
      this.selectedPermissionIds = [];
    }
  }

  // Metodo para cambiar el estado de un permiso
  onPermissionChange(permissionId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      if (!this.selectedPermissionIds.includes(permissionId)) {
        this.selectedPermissionIds.push(permissionId);
      }
    } else {
      this.selectedPermissionIds = this.selectedPermissionIds.filter(id => id !== permissionId);
    }
    console.log(this.selectedPermissionIds);
  }

  // Metodo para agregar un rol con permisos
  addRoleWithPermissions() {
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

    if (this.selectedRoleId !== null && this.selectedPermissionIds.length > 0) {
      const existingRole = this.selectedRoles.find(role => role.role === this.selectedRoleId);

      if (existingRole) {
        existingRole.permissions = [...new Set([...existingRole.permissions, ...this.selectedPermissionIds])];
        console.log('Permisos actualizados para el rol existente:', existingRole);
      } else {
        const newRole = {
          role: this.selectedRoleId,
          permissions: [...this.selectedPermissionIds],
        };
        this.selectedRoles.push(newRole);
        console.log('Nuevo rol creado:', newRole);
      }

      this.selectedPermissionIds = [];
      this.selectedRoleId = null;
      this.showPermissions = false;

      console.log('Roles seleccionados:', this.selectedRoles);
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

  // Metodo para actualizar un usuariob y sus roles y permisos
  updateUser() {
    if (this.selectedRoles.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar al menos un rol.',
        timer: 3000,
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (this.formUser.valid) {
      const user: CreateUser = { ...this.formUser.value };

      user.roles = this.selectedRoles.map((role) => ({
        role: role.role,
        permissions: role.permissions,
      })).filter((value, index, self) =>
        index === self.findIndex((t) => t.role === value.role)
      );

      console.log("Roles seleccionados:", this.selectedRoles);
      if (user.enabled == null) {
        user.enabled = false;
      }

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
            this.selectedRoles = [];

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

  // Método para obtener el usuario por su id
  getUsuarioById(id: number) {
    this.showPermissionsEdit = true;
    const user = this.usuariosArray.find((u: Usuario) => u.idUser === id);
    console.log(user);

    if (user) {
      console.log('Roles y permisos del usuario:', user.userRoles);

      this.selectedUser = { ...user };
      this.selectedRoles = user.userRoles.map((userRole: UserRoles) => ({
        role: userRole.role.idRole,
        permissions: userRole.permission.length > 0 ? userRole.permission.map((perm: Permission) => perm.idPermission) : [],
      }));

      this.selectedRoleId = this.selectedRoles.length > 0 ? this.selectedRoles[0].role : null;
      this.selectedPermissionIds = this.selectedRoles.flatMap(role => role.permissions);

      const isVendedor = user.userRoles.some((userRole: UserRoles) => userRole.role.idRole === 2);

      this.formUser.patchValue({
        ...user,
        isVendedor: isVendedor,
      });


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

  // Método para crear el usuario
  createUser(): void {
    if (this.selectedRoles.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar al menos un rol.',
        timer: 3000,
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const isVendedorSelected = this.selectedRoles.some(role => role.role === 2);

    if (isVendedorSelected) {
      this.formUser.get('isVendedor')?.setValue(true);
    } else {
      this.formUser.get('isVendedor')?.setValue(false);
    }

    if (this.formUser.valid) {
      const user: CreateUser = { ...this.formUser.value };

      if (user.enabled == null) {
        user.enabled = false;
      }

      if (this.formUser.get('isVendedor')?.value === true) {
        user.porcentajeLiquidacion = Number(this.formVendedor.get('porcentaje')?.value);
      }

      console.log("Roles seleccionados:", this.selectedRoles);

      user.roles = this.selectedRoles.map((role) => ({
        role: role.role,
        permissions: role.role === 1 ? [] : role.permissions,
      }));

      console.log("Usuario a enviar:", user);

      // this.usuarioService
      //   .saveUser(user)
      //   .pipe(
      tap((data) => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'El usuario ha sido creado exitosamente.',
          timer: 3000,
          confirmButtonColor: '#3085d6',
        });
        // this.usuariosArray.push(data);
        this.formUser.reset();
        this.selectedRoles = [];
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
      // )
      // .subscribe();
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

  // Metodo para obtener los roles
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

  // Metodo para obtener los permisos
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

  // Metodo para obtener los usuarios
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

  // Metodo para buscar un usuario
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

  // Metodo para limpiar el formulario de usuario
  clearUser() {
    this.editUser = false;
    this.formUser.reset();
  }

  // Metodo para cerrar el modal
  closeModal() {
    this.showPermissionsEdit = false;
    this.showPermissions = false;
    this.formUser.reset();
    this.formVendedor.reset();
    this.selectedRoles = [];
    this.selectedPermissionIds = [];
    this.selectedRoleId = null;
    this.selectedUser = null;
  }

}
