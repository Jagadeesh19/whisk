import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {domain_name} from "../../server.config";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  isLoading=false;
  requestComplete=false;
  show=false;
  alertMessage:string;

  constructor(private http:HttpClient) { }

  ngOnInit() {
  }


  onResetRequest(resetForm:NgForm){
    this.isLoading=true;
    this.http.post(domain_name+"/api/reset",resetForm.value)
      .subscribe(
        response=>{
          this.isLoading=false;
          this.requestComplete=true;
        },
        (err:ErrorEvent)=>{
          this.show=true;
          this.isLoading=false;
          this.alertMessage=err.error.message;
        }
      )
  }

  closeAlert(){
    this.show=false;
  }
}
