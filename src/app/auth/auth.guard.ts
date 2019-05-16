import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

import {AuthService} from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(
    private authService:AuthService,
    private router:Router
  ){}

  canActivate(
    route:ActivatedRouteSnapshot,
    state:RouterStateSnapshot
  ):Observable<boolean> | Promise<boolean> | boolean
  {
    const isAuth=this.authService.getAuthStatus();
    const userType=this.authService.getUserType();
    const routeType=state.url.split("/")[1];
    console.log(userType,routeType);
    if (!isAuth){
      this.router.navigate(["/login"]);
    }
    if ((routeType==="admin" && userType==="admin") || (routeType!=="admin" && userType!=="admin")){
      return true;
    }
    return false;
  }
}
