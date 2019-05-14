import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";

import {EmployeeService} from "../admin-employees/employee.service";
import {EmployeeModel} from "../employee.model";

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  genders:string[]=["male","female","other"];
  addEmployeeForm:FormGroup;
  date:Date;
  maxDate:NgbDateStruct;
  show:boolean=false;
  employee:EmployeeModel;
  employeeId:string;
  dob:NgbDateStruct;
  animation:boolean=false;
  message:string;
  error:boolean=false;
  edit:boolean;
  buttonName:string="Add Employee";

  constructor(
    private http:HttpClient,
    private route:ActivatedRoute,
    private employeeService:EmployeeService
  ) { }

  ngOnInit() {
    this.employeeId=this.route.snapshot.params.id;
    this.employee=this.employeeService.getEmployee(this.employeeId);
    let name=null;
    let email=null;
    let gender=null;
    let dateOfBirth=null;
    let supervisorEmail=null;

    if (this.employee){
      this.buttonName="Update Employee"
      this.edit=true;
      name=this.employee.name;
      email=this.employee.email;
      gender=this.employee.gender;
      dateOfBirth=this.employee.dateOfBirth;
      dateOfBirth=this.employeeService.parseJsonDate(dateOfBirth);
      console.log(dateOfBirth);
      dateOfBirth=this.dateToNgb(dateOfBirth);
      if (this.employee.supervisor){
        supervisorEmail=this.employee.supervisor.email;
      }
    }

    this.addEmployeeForm=new FormGroup({
      "name":new FormControl(name,Validators.required),
      "email": new FormControl(email,[Validators.required,Validators.email]),
      "gender":new FormControl(gender),
      "dateOfBirth": new FormControl(dateOfBirth,Validators.required),
      "supervisorEmail": new FormControl(supervisorEmail,Validators.email)
    });

    this.date=new Date();
    this.date.setFullYear(this.date.getFullYear()-18);
    this.maxDate=this.dateToNgb(this.date);
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

  onAddEmployee(){
    this.animation=true;
    this.show=false;
    this.employee=this.addEmployeeForm.value;
    this.employee.joinDate=new Date();
    this.dob=this.employee.dateOfBirth;
    this.employee.dateOfBirth=new Date(this.dob.year,this.dob.month-1,this.dob.day);
    console.log(this.employee.dateOfBirth);
    if (!this.edit){
      this.http.post<{message:string}>("http://localhost:3000/api/admin/add",this.employee)
        .subscribe((responseData)=>{
          console.log(responseData);
          if (responseData.message==="Success"){
            this.addEmployeeForm.reset();
            this.animation=false;
            this.show=true;
            this.message="Employee Added Successfully";
            this.error=false;
          }
          else{
            this.animation=false;
            this.show=true;
            this.message=responseData.message;
            this.error=true;
          }
        })
    }
    else {
      this.employee._id=this.employeeId;
      this.http.post<{message:string}>("http://localhost:3000/api/admin/edit",this.employee)
        .subscribe(
            (response)=>{
              this.addEmployeeForm.reset();
              this.animation=false;
              this.show=true;
              this.message=response.message;
              this.error=false;
            },
            (err:ErrorEvent)=>{
              this.animation=false;
              this.show=true;
              this.message=err.error.message;
              this.error=true;
            }
        )
    }
  }

}
