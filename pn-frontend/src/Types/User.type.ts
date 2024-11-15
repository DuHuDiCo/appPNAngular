export interface Role {
}

export interface Permissions {
}

export interface Roles {
    role: Role;
    permissions: Permissions[];
}

export interface Usuario {
    idUser: number;
    name: string;
    lastname: string;
    email: string;
    password: string;
    roles: Roles[];
}

