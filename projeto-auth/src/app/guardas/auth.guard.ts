import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({providedIn: 'root'})

//Midleware
//Implements ( faz um contrato com uma interface )
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router : Router){}

  canActivate(): boolean {
    if(this.authService.estaAutenticado()){
      return true;
    }else{
      this.router.navigate(['/login'])
      return false;
    }
  }
}