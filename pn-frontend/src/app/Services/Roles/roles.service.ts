import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import baseUrl from 'src/Environments/helper';
import { Permission, Role } from 'src/Interface/User.type';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${baseUrl}/role/role/`)
  }

  getRoleById(id: number) {
    return this.http.get(`${baseUrl}/role/role/${id}`)
  }

  getPermisos(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${baseUrl}/role/permission/`)
  }

  getPermisoById(id: number) {
    return this.http.get(`${baseUrl}/role/permission/${id}`)
  }
}
