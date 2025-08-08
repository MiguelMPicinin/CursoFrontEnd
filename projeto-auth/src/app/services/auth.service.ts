import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //atributos
  private apiUrl = "Http://localhost:3014/usuarios"
  private readonly CHAVE_AUTH = 'usuarioLogado'

  constructor(private router: Router, private http: HttpClient) {   }

  //métodos 

  // cadastrar o usuario no sistema
  registrar(usuario: any): Observable<any>{
    // Verificar se o Usuario ja existe (get -> email)
    return this.http.get<any[]>(`${this.apiUrl}?email=${usuario.email}`).pipe(
      map(usuarios => {
        //Se usuario ja existe
        if (usuarios.length > 0)
        {
          //Lanço um erro para o sistema 
          throw new Error('Usuario ja Cadastrado');
        }
        return usuario
      }),
      //caso o usuario não exista 
      switchMap( novoUsuario => this.http.post(this.apiUrl, novoUsuario).pipe(tap(() => alert("Registro realizado com Sucesso"))
      )),
      //pegar erros de conexão
      catchError(err => {
        alert (`Erro: ${err.message}`);
        throw err
      })
    )
  }

  //método para logar usuarios ja registrados
  login(credenciais: any): Observable<boolean>{
    // passar para o banco uma busca com email e senha 
    return this.http.get<any[]>(
      `${this.apiUrl}?email=${credenciais.email}&senha=${credenciais.senha}`
    ).pipe(map((usuarios) => { //usuario existe email e senha cadastrados/ se não for encontrado
          if (usuarios.length === 0) return false; // o usuario  e sua chave de autenticação => localStorage 
          const usuario = usuarios[0];
          localStorage.setItem(this.CHAVE_AUTH, JSON.stringify(usuario))
          return true; // deu certo -> pode avançar
        }));
  }

  //Metodo para deslogar o usuario
  logout(){
    //limpo o local storage
    localStorage.removeItem(this.CHAVE_AUTH);
    //redireciono para outra pagina
    this.router.navigate(["/home"])
  }

  //verifica se esta logado e ja fez autenticação
  // (autorização do acesso)
  estaAutenticado():boolean{
    //transformando a verificação da String em Boolean
    return !! localStorage.getItem(this.CHAVE_AUTH);
  }
  //pegar os dados do usuario
  getUsuarioAtual():any{
    // quando eu armazeno no local storage -> texto
    //quando vou pegar do local storage eu converto para JSON
    return JSON.parse(localStorage.getItem(this.CHAVE_AUTH) || '{}');
  }

}
