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

  constructor(private authService:AuthService) { }

  ngOnInit() {
  }

  onLogin(form:NgForm){
    this.isLoading=true;
    this.authService.login(form.value.username,form.value.password)
  }

}
