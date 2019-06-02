import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {AddEmployeeComponent} from "./admin/add-employee/add-employee.component";
import {EmployeesComponent} from "./admin/employees/employees.component";
import {EmployeeComponent} from "./admin/employees/employee/employee.component";
import {LoginComponent} from "./auth/login/login.component";
import {AuthGuard} from "./auth/auth.guard";
import {ApplyLeaveComponent} from "./employee/apply-leave/apply-leave.component";
import {ResetPasswordComponent} from "./auth/reset-password/reset-password.component";
import {NewPasswordComponent} from "./auth/new-password/new-password.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {LeaveStatusComponent} from "./employee/leave-status/leave-status.component";
import {LeavesComponent} from "./employee/leave-status/leaves/leaves.component";
import {LeaveGrantComponent} from "./employee/leave-grant/leave-grant.component";

const appRoutes:Routes=[
  {
    path:"",
    component:HomePageComponent
  },
  {
    path: "admin/add-employee",
    component:AddEmployeeComponent,
    canActivate:[AuthGuard]
  },
  {
    path: "admin/edit-employee/:id",
    component:AddEmployeeComponent,
    canActivate:[AuthGuard]
  },
  {
    path:"admin/employees",
    component: EmployeesComponent,
    children:[
      {
        path:":id",
        component:EmployeeComponent
      }
    ],
    runGuardsAndResolvers: "always",
    canActivate:[AuthGuard]
  },
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"reset-password",
    component:ResetPasswordComponent
  },
  {
    path: "reset/:token",
    component:NewPasswordComponent
  },
  {
    path:"apply-leave",
    component:ApplyLeaveComponent,
    canActivate:[AuthGuard]
  },
  {
    path:"leave-grant",
    component:LeaveGrantComponent,
    canActivate:[AuthGuard]
  },
  {
    path:"leave-status",
    component:LeaveStatusComponent,
    canActivate:[AuthGuard],
    children:[
      {
        path:"leaves/:leaveType",
        component: LeavesComponent
      }
    ]
  },
  {
    path: "not-found",
    component:PageNotFoundComponent
  },
  {
    path: "**",
    redirectTo: "not-found"
  }
]

@NgModule({
  imports:[
    RouterModule.forRoot(appRoutes,{
      onSameUrlNavigation:"reload"
    })
  ],
  exports:[
    RouterModule
  ],
  providers:[
    AuthGuard
  ]
})
export class AppRoutingModule {

}
