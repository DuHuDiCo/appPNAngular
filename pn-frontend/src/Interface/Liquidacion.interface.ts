export interface Liquidacion {
  idUser: number;
  idProductos: number[];
}

export interface LiquidacionArray {
  idLiquidacion: number;
  fecha: Date;
  valorVenta: number;
  valorLiquidado: number;
  vendedor: Vendedor;
}

export interface Vendedor {
  idUser: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  dateCreated: Date;
  enabled: boolean;
  porcentajeLiquidacion: number;
  userRoles: UserRole[];
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  authorities: Authority[];
  username: string;
}

export interface Authority {
  authority: string;
}

export interface UserRole {
  idUserRol: number;
  role: Role;
  permission: Permission;
}

export interface Permission {
  idPermission: number;
  permission: string;
}

export interface Role {
  idRole: number;
  role: string;
}
