import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from 'src/Environments/helper';
import { CreateUser, Usuario } from 'src/Interface/User.type';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) { }

  getUsers(){
    return this.http.get(`${baseUrl}/user/`)
  }

  saveUser(user: CreateUser){
    return this.http.post(`${baseUrl}/user/`, user)  
  }

  editUser(id: number, user: CreateUser){
    return this.http.put(`${baseUrl}/user/${id}`, user)
  }

  buscarUsuario(dato: string){
    return this.http.get(`${baseUrl}/user/nameOrLastName?dato=${dato}`);
  }

}
