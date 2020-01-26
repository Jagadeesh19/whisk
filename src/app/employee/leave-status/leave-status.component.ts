import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../auth/auth.service";
import {domain_name} from "../../server.config";

enum Months {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

@Component({
  selector: 'app-leave-status',
  templateUrl: './leave-status.component.html',
  styleUrls: ['./leave-status.component.scss']
})
export class LeaveStatusComponent implements OnInit {
  isLoading=true;

  leaveTypes=[
    "Annual leaves",
    "Work from home",
    "Loss of Pay",
    "Comp off"
  ];

  joinDate:Date;

  years:number[]=[];

  months=[
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];


  year:number;

  month=this.months[0];

  leaveType=this.leaveTypes[0];

  constructor(
    private router:Router,
    private http:HttpClient,
    private authService:AuthService
  ) { }

  ngOnInit() {
    const employeeId=this.authService.getUserId();
    this.http.get<{joinDate:string}>(domain_name+"/api/employee/join-date/"+employeeId)
      .subscribe(response=>{
        const isoJoinDate=response.joinDate;
        this.joinDate=new Date(isoJoinDate);
        const date=new Date();
        const last=date.getFullYear();
        const first=this.joinDate.getFullYear();
        console.log(first,last);
        for (let i=first;i<=last;++i){
          this.years.push(i);
        }
        this.year=this.years[0];
        this.isLoading=false;
      })
  }


  onLeaveTypeChange(leaveType:string){
    this.leaveType=leaveType;
    this.router.navigate(["leave-status","leaves",this.leaveType],{
      queryParams:{year:this.year,month:Months[this.month]}
    })
  }

  onFilterChange(year:number,month:string){
    this.month=month;
    this.year=year;
    this.router.navigate(["leave-status","leaves",this.leaveType],{
      queryParams:{year:this.year,month:Months[this.month]}
    })
  }

}
