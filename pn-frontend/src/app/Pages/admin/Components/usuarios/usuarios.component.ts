import { Component, OnInit } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { UsuarioService } from 'src/app/Services/User/usuario.service';
import { Usuario } from 'src/Interface/User.type';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  // ARRAY
  usuariosArray: Usuario[] = []
  
  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.getUsuarios()
  }

  getUsuarios(){
    this.usuarioService.getUsers().pipe(
      tap((data: any) => {
        this.usuariosArray = data
        console.log(data);
      }), catchError((error: Error) => {
        console.log(error);
        return of([])
      })
    ).subscribe()
  }

}
