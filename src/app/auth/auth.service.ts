import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

import {AuthData} from "./auth-data.model";

@Injectable({providedIn:"root"})
export class AuthService {
  private token:string;
  private authStatusListener=new Subject<boolean>();
  private isAuth=false;
  private tokenTimer;

  constructor(
    private http:HttpClient,
    private router:Router
  ){ }

  getToken(){
    return this.token;
  }

  login(username:string,password:string){
    const authData:AuthData={username:username,password:password}
    this.http.post<{token:string,expiresIn:number}>("http://localhost:3000/api/login",authData)
      .subscribe(response=>{
        const token=response.token;
        this.token=token;
        if (token){
          const expiresInDuration=response.expiresIn;
          this.tokenTimer=setTimeout(()=>{
            this.logout();
          },expiresInDuration*1000);
          this.authStatusListener.next(true);
          this.isAuth=true;
          this.router.navigate(["/"])
        }

      })
  }

  getAuthStatus(){
    return this.isAuth;
  }

  logout(){
    this.token=null;
    this.isAuth=false;
    this.authStatusListener.next(false);
    this.router.navigate(["/"]);
    clearTimeout(this.tokenTimer);
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }
}
