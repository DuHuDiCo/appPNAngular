export interface Role {
  idRole: number;
  role: string;
}

export interface Permission {
  idPermission: number;
  permission: string;
}

export interface UserRoles {
  idUserRol: number;
  role: Role;
  permission: Permission[];
}

export interface Usuario {
  idUser: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  dateCreated: string;
  userRoles: UserRoles[];
  enabled: boolean;
  porcentajeLiquidacion: number;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  username: string;
  authorities: Authorities[];
}

export interface Authorities {
  authority: string;
}

export interface Login {
  username: string;
  password: string;
}

export interface CreateUser {
  idUser: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  enabled: boolean;
  porcentajeLiquidacion: number;
  roles: any[];
}
