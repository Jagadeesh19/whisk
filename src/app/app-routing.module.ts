import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {AddEmployeeComponent} from "./admin/add-employee/add-employee.component";
import {EmployeesComponent} from "./admin/employees/employees.component";
import {EmployeeComponent} from "./admin/employees/employee/employee.component";
import {LoginComponent} from "./auth/login/login.component";
import {AuthGuard} from "./auth/auth.guard";
import {ApplyLeaveComponent} from "./employee/apply-leave/apply-leave.component";

const appRoutes:Routes=[
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
    path:"apply-leave",
    component:ApplyLeaveComponent,
    canActivate:[AuthGuard]
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
