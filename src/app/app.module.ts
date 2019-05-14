import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http'
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './header/header.component';
import {AppRoutingModule} from "./app-routing.module";
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { AdminEmployeesComponent } from './admin-employees/admin-employees.component';
import { EmployeeComponent } from './admin-employees/employee/employee.component';
import {EmployeeService} from "./admin-employees/employee.service";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    AddEmployeeComponent,
    AdminEmployeesComponent,
    EmployeeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [
    EmployeeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
