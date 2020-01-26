import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient} from "@angular/common/http";

import {AuthService} from "../../auth/auth.service";
import {LeaveModel} from "../leave-status/leave.model";
import {ActivatedRoute, Router} from "@angular/router";
import {domain_name} from "../../server.config";

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.scss']
})
export class ApplyLeaveComponent implements OnInit {
  applyLeaveForm:FormGroup;
  isLoading=false;
  minStartDate:NgbDateStruct;
  days:number=0;
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
    private http:HttpClient,
    private router:Router,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.applyLeaveForm=new FormGroup({
      "leaveType":new FormControl("Annual leave"),
      "startDate":new FormControl(null,Validators.required),
      "endDate":new FormControl(null,Validators.required),
      "leaveDescription": new FormControl(null,Validators.required),
      "contactInfo": new FormControl(null,Validators.required),
      "days":new FormControl(0)
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

  workingDaysBetweenDates(startDate, endDate) {

    // Validate input
    if (endDate < startDate)
      return 0;

    // Calculate days between dates
    var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
    startDate.setHours(0,0,0,1);  // Start just after midnight
    endDate.setHours(23,59,59,999);  // End just before midnight
    var diff = endDate - startDate;  // Milliseconds between datetime objects
    var days = Math.ceil(diff / millisecondsPerDay);

    // Subtract two weekend days for every week in between
    var weeks = Math.floor(days / 7);
    days = days - (weeks * 2);

    // Handle special cases
    var startDay = startDate.getDay();
    var endDay = endDate.getDay();

    // Remove weekend not previously removed.
    if (startDay - endDay > 1)
      days = days - 2;

    // Remove start day if span starts on Sunday but ends before Saturday
    if (startDay == 0 && endDay != 6)
      days = days - 1

    // Remove end day if span ends on Saturday but starts after Sunday
    if (endDay == 6 && startDay != 0)
      days = days - 1

    return days;
  }


  onApplyLeave(){
    this.isLoading=true;
    this.show=false;
    const leave:LeaveModel=this.applyLeaveForm.value;
    leave.employeeId=this.userId;
    leave.startDate=this.ngbToDate(leave.startDate);
    leave.endDate=this.ngbToDate(leave.endDate);
    leave.appliedDate=new Date();

    this.http.post<{message:string}>(domain_name+"/api/employee/apply-leave",leave)
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

  updateDays(){
    let startDate=this.applyLeaveForm.value.startDate;
    let endDate=this.applyLeaveForm.value.endDate;
    startDate=new Date(startDate.year,startDate.month-1,startDate.day);
    endDate=new Date(endDate.year,endDate.month-1,endDate.day);
    const days=this.workingDaysBetweenDates(startDate,endDate);
    this.applyLeaveForm.controls["days"].setValue(days);
  }

  closeAlert(){
    this.show=false;
  }

}
