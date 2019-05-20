import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  isLoading=false;
  requestComplete=false;

  constructor(private http:HttpClient) { }

  ngOnInit() {
  }


  onResetRequest(resetForm:NgForm){
    this.isLoading=true;
    this.http.post("http://localhost:3000/api/reset",resetForm.value)
      .subscribe(response=>{
        this.isLoading=false;
        this.requestComplete=true;
      })
  }
}
