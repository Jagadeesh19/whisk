import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

import {EmployeeService} from "../employee.service";
import {EmployeeModel} from "../../employee.model";
import {domain_name} from "../../../server.config";


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  employeeId:string;
  employee:EmployeeModel;
  error;

  constructor(
    private employeeService:EmployeeService,
    private route:ActivatedRoute,
    private http:HttpClient,
    private router:Router
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params:Params)=>{
        this.employeeId=params.id;
        this.employee=this.employeeService.getEmployee(this.employeeId);
        this.error=null;
      })
  }

  onEditEmployee(){
    this.router.navigate(["admin","edit-employee",this.employeeId])
  }

  onRemoveEmployee(){
    this.http.delete(`${domain_name}/api/admin/remove/${this.employee._id}`,{
      observe:"response"
    })
      .subscribe(
        response=>{
          console.log(response);
          this.router.navigate(["admin","employees"],{

          })
        },
        (error:HttpErrorResponse)=>{
          this.error=error.error.message;
        }
      )
  }

  closeAlert(){
    this.error=null;
  }

}
