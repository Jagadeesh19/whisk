import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './header/header.component';
import {AppRoutingModule} from "./app-routing.module";
import { AddEmployeeComponent } from './admin/add-employee/add-employee.component';
import { EmployeesComponent } from './admin/employees/employees.component';
import { EmployeeComponent } from './admin/employees/employee/employee.component';
import {EmployeeService} from "./admin/employees/employee.service";
import {AuthInterceptor} from "./auth/auth-interceptor";
import { ApplyLeaveComponent } from './employee/apply-leave/apply-leave.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { NewPasswordComponent } from './auth/new-password/new-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LeaveStatusComponent } from './employee/leave-status/leave-status.component';
import { LeavesComponent } from './employee/leave-status/leaves/leaves.component';
import {AuthService} from "./auth/auth.service";
import {LeavesService} from "./employee/leave-status/leaves.service";
import { LeaveComponent } from './employee/leave-status/leaves/leave/leave.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    AddEmployeeComponent,
    EmployeesComponent,
    EmployeeComponent,
    ApplyLeaveComponent,
    ResetPasswordComponent,
    NewPasswordComponent,
    PageNotFoundComponent,
    HomePageComponent,
    LeaveStatusComponent,
    LeavesComponent,
    LeaveComponent
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
    EmployeeService,
    AuthService,
    LeavesService,
    {
      multi:true,
      provide:HTTP_INTERCEPTORS,
      useClass: AuthInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
