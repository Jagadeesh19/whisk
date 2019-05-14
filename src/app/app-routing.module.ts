import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AddEmployeeComponent} from "./admin/add-employee/add-employee.component";
import {EmployeesComponent} from "./admin/employees/employees.component";
import {EmployeeComponent} from "./admin/employees/employee/employee.component";
import {LoginComponent} from "./auth/login/login.component";

const appRoutes:Routes=[
  {
    path: "admin/add-employee",
    component:AddEmployeeComponent
  },
  {
    path: "admin/edit-employee/:id",
    component:AddEmployeeComponent
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
    runGuardsAndResolvers: "always"
  },
  {
    path:"login",
    component:LoginComponent
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
  ]
})
export class AppRoutingModule {

}
