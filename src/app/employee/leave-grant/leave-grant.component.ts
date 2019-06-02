import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-leave-grant',
  templateUrl: './leave-grant.component.html',
  styleUrls: ['./leave-grant.component.scss']
})
export class LeaveGrantComponent implements OnInit {
  alertMessage:string;
  show=false;
  messageType="success";
  leaveGrantForm:FormGroup;
  isLoading=false;
  minDate:NgbDateStruct;

  constructor(
    private http:HttpClient,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.leaveGrantForm=new FormGroup({
      "startDate":new FormControl(null,[Validators.required,this.dateValidator]),
      "endDate":new FormControl(null,[Validators.required,this.dateValidator]),
      "workDescription":new FormControl(null,Validators.required),
      "days":new FormControl(0,Validators.required)
    })

    const date=new Date();
    this.minDate={
      year:date.getFullYear(),
      month:date.getMonth(),
      day:date.getDate()
    };
  }

  updateDays(){
    let date1=this.leaveGrantForm.value["startDate"];
    let date2=this.leaveGrantForm.value["endDate"];
    date1=new Date(date1.year,date1.month-1,date1.day);
    date2=new Date(date2.year,date2.month-1,date2.day);
    const days=this.calculateDays(date2,date1);
    this.leaveGrantForm.controls["days"].setValue(days);
  }

  dateValidator(control:AbstractControl){
    const ngbDate:NgbDateStruct=control.value;
    if (ngbDate){
      const date=new Date(ngbDate.year,ngbDate.month-1,ngbDate.day);
      const day=date.getDay();
      if (day===6 || day===0) return null;
      return {"dateValidator":true};
    }
    return null;
  }

  calculateDays(date1,date2){
    return (date1-date2)/(24*3600*1000)+1;
  }

  onLeaveGrant(){
    this.isLoading=true;
    const request=this.leaveGrantForm.value;
    const startDate=request.startDate;
    const endDate=request.endDate;
    request.startDate=new Date(startDate.year,startDate.month-1,startDate.day)
    request.endDate=new Date(endDate.year,endDate.month-1,endDate.day);
    request.employeeId=this.authService.getUserId();
    this.http.post<{message:string}>("http://localhost:3000/api/employee/leave-grant",request)
      .subscribe(
        response=>{
          this.isLoading=false;
          this.show=true;
          this.alertMessage=response.message;
        }
      )
  }
}
