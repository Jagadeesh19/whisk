import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  isLoading=false;
  validUrl=false;
  message:string;
  userType:string;
  token:string;
  resetFinished=false;

  constructor(
    private http:HttpClient,
    private route:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit() {
    this.token=this.route.snapshot.params.token;
    this.userType=this.route.snapshot.queryParams.userType;
    console.log(this.token,this.userType);
    this.http.post("http://localhost:3000/api/valid-token",{
      token:this.token,
      userType:this.userType
    })
      .subscribe(
        response=>{
          this.validUrl=true;
        },
        err=>{
          this.router.navigate(["page-not-found"]);
        }
      )
  }

  onResetPassword(form:NgForm){
    this.isLoading=true;
    this.http.post<{message:string}>("http://localhost:3000/api/new-password",{
      password:form.value.password,
      userType:this.userType,
      token:this.token
    })
      .subscribe(
        response=>{
          this.isLoading=false;
          this.message=response.message;
          this.resetFinished=true;
        }
      )
  }

}
