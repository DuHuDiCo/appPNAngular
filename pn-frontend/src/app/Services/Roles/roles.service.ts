import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from 'src/Environments/helper';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  getRoles() {
    return this.http.get(`${baseUrl}/role/role`)
  }

  getRoleById(id: number) {
    return this.http.get(`${baseUrl}/role/role/${id}`)
  }

  getPermisos() {
    return this.http.get(`${baseUrl}/role/permission/`)
  }

  getPermisoById(id: number) {
    return this.http.get(`${baseUrl}/role/permission/${id}`)
  }
}
