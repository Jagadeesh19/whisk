import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";

import {EmployeeService} from "./employee.service";
import {EmployeeModel} from "../employee.model";

@Component({
  selector: 'app-admin-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, OnDestroy {
  animation:boolean=true;
  employees:EmployeeModel[];
  employeeHeaders=[
    "#",
    "Name",
    "Email",
    "Join Date",
    "gender",
    "Supervisor"
  ];
  parseJsonDate;
  navigationSubscription: Subscription;

  constructor(
    private http:HttpClient,
    private router:Router,
    private employeeService:EmployeeService
  ) {

    this.parseJsonDate=this.employeeService.parseJsonDate;

    this.navigationSubscription=this.router.events.subscribe(
      (e:any)=>{
        if (e instanceof NavigationEnd){
          this.ngOnInit();
        }
      }
    )
  }

  ngOnInit() {
    this.http.get("http://localhost:3000/api/admin/employees")
      .subscribe((employees:EmployeeModel[])=>{
        this.employees=employees;
        this.employeeService.initialize(this.employees);
        this.animation=false;
      })
  }

  onSelectingEmployee(employee){
    this.router.navigate(["admin","employees",employee._id]);
  }

  ngOnDestroy(): void {

    if (this.navigationSubscription){
      this.navigationSubscription.unsubscribe();
    }
  }
}
