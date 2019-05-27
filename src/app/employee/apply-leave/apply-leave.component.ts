import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient} from "@angular/common/http";

import {AuthService} from "../../auth/auth.service";
import {LeaveModel} from "../leave-status/leave.model";

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.scss']
})
export class ApplyLeaveComponent implements OnInit {
  applyLeaveForm:FormGroup;
  isLoading=false;
  minStartDate:NgbDateStruct;
  userId:string;
  leaveTypes=[
    "loss of pay",
    "Annual leave",
    "Work from home",
    "Comp off"
  ];
  show=false;
  messageType:string;
  alertMessage:string;

  constructor(
    private authService:AuthService,
    private http:HttpClient
  ) { }

  ngOnInit() {
    this.applyLeaveForm=new FormGroup({
      "leaveType":new FormControl("Annual leave"),
      "startDate":new FormControl(null,Validators.required),
      "endDate":new FormControl(null,Validators.required),
      "leaveDescription": new FormControl(null,Validators.required),
      "contactInfo": new FormControl(null,Validators.required)
    })

    this.minStartDate=this.dateToNgb(new Date());
    this.userId=this.authService.getUserId();
  }

  dateToNgb(date:Date):NgbDateStruct{
    const day=date.getDate();
    const month=date.getMonth()+1;
    const year= date.getFullYear();
    return {
      day:day,
      month:month,
      year:year
    }
  }

  onApplyLeave(){
    this.isLoading=true;
    this.show=false;
    const leave:LeaveModel=this.applyLeaveForm.value;
    leave.employeeId=this.userId;
    leave.startDate=this.ngbToDate(leave.startDate);
    leave.endDate=this.ngbToDate(leave.endDate);
    leave.appliedDate=new Date();

    this.http.post<{message:string}>("http://localhost:3000/api/employee/apply-leave",leave)
      .subscribe(
        response=>{
          this.isLoading=false;
          this.messageType="success";
          this.show=true;
          this.alertMessage=response.message;
          this.applyLeaveForm.reset();
        },
        (err:ErrorEvent)=>{
          this.isLoading=false;
          this.messageType="danger";
          this.show=true;
          this.alertMessage=err.error.message;
        }
      )
  }

  ngbToDate(date:NgbDateStruct){
    return new Date(date.year,date.month-1,date.day);
  }

  closeAlert(){
    this.show=false;
  }

}
