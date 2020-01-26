import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";

import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading=false;
  message:string;
  show=false;

  constructor(private authService:AuthService) { }

  ngOnInit() {
  }

  onLogin(form:NgForm){
    this.isLoading=true;
    this.authService.getLoadingListener().subscribe(err=>{
      this.isLoading=false;
      this.message="Please enter valid username and password";
      this.show=true;
    })
    this.show=false;
    this.authService.login(form.value.username,form.value.password)
  }

  closeAlert(){
    this.show=false;
  }

}
