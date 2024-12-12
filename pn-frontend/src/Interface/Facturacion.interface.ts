export interface Facturacion {
  idFacturacion: number;
  fecha: Date;
  totalFacturacion: number;
  user: User;
  productoCompraFacturacion: ProductoCompraFacturacion[];
}

export interface ProductoCompraFacturacion {
  idProductoCompraFacturacion: number;
  productoCompraInventory: ProductoCompraInventory;
  client: Client;
  facturacion: string;
  valorVenta: number;
  cantidad: number;
  totalVenta: number;
  descuentoPagoInicial: number;
  liquidacion: Liquidacion;
}

export interface Client {
  idClient: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  enabled: boolean;
  user: User;
}

export interface User {
  idUser: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  dateCreated: Date;
  enabled: boolean;
  porcentajeLiquidacion: number;
  userRoles: UserRole[];
  authorities: Authority[];
  username: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
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

export interface Liquidacion {
  idLiquidacion: number;
  fecha: Date;
  valorVenta: number;
  valorLiquidado: number;
  vendedor: User;
}

export interface ProductoCompraInventory {
  idProductoCompraInventory: number;
  productoCompra: ProductoCompra;
  inventory: Inventory;
  user: User;
  productoCompraFacturacions: string[];
}

export interface Inventory {
  idInventory: number;
  dateInventory: Date;
  totalInventoryValue: number;
  quantity: number;
  quantitySinFacturacion: number;
  facturacion: string;
}

export interface ProductoCompra {
  idProductoCompra: number;
  cantidad: number;
  costo: number;
  flete: number;
  producto: Producto;
  user: User;
  productoCompraInventory: string[];
}

export interface Producto {
  idProducto: number;
  producto: string;
  descripcion: string;
  imagenes: Imagene[];
  clasificacionProducto: ClasificacionProducto;
}

export interface ClasificacionProducto {
  idClasificacionProducto: number;
  clasificacionProducto: string;
  isFleteObligatorio: boolean;
}

export interface Imagene {
  idArchivo: number;
  filename: string;
  ruta: string;
  size: number;
  extention: string;
  urlPath: string;
  fechaCreacion: Date;
}
