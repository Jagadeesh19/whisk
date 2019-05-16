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
  private loadingListener=new Subject<boolean>();
  private userType:string;

  constructor(
    private http:HttpClient,
    private router:Router
  ){ }

  getToken(){
    return this.token;
  }

  getLoadingListener(){
    return this.loadingListener.asObservable();
  }

  getUserType(){
    return this.userType;
  }

  login(username:string,password:string){
    const authData:AuthData={username:username,password:password}
    this.http.post<{token:string,expiresIn:number,userType:string}>("http://localhost:3000/api/login",authData)
      .subscribe(
        response=>{
          const token=response.token;
          this.token=token;
          if (token){
            this.userType=response.userType;
            const expiresInDuration=response.expiresIn;
            this.setAuthTimer(expiresInDuration*1000);
            this.authStatusListener.next(true);
            this.isAuth=true;
            const now=new Date();
            const expirationDate=new Date(now.getTime()+expiresInDuration*1000);
            this.saveAuthData(token,expirationDate);
            this.router.navigate(["/"]);
          }

        },
        (err)=>{
          this.loadingListener.next(false);
        }
      )
  }

  getAuthStatus(){
    return this.isAuth;
  }

  autoAuthUser(){
    const authInformation=this.getAuthData();
    if (!authInformation){
      return;
    }
    const now=new Date();
    const expiresIn=authInformation.expirationDate.getTime()-now.getTime();
    if (expiresIn>0){
      this.token=authInformation.token;
      this.isAuth=true;
      this.setAuthTimer(expiresIn);
      this.authStatusListener.next(true);
      this.userType=authInformation.userType;
    }
  }

  logout(){
    this.token=null;
    this.isAuth=false;
    this.authStatusListener.next(false);
    this.router.navigate(["/"]);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  private setAuthTimer(duration:number){
    this.tokenTimer=setTimeout(()=>{
      this.logout();
    },duration);
  }

  private saveAuthData(token:string,expirationDate: Date){
    localStorage.setItem("token",token);
    localStorage.setItem("expiration",expirationDate.toISOString());
    localStorage.setItem("userType",this.userType);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userType");
  }

  private getAuthData(){
    const token=localStorage.getItem("token");
    const expirationDate=localStorage.getItem("expiration");
    const userType=localStorage.getItem("userType");
    if (!token || !expirationDate || !userType){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userType:userType
    }
  }
}