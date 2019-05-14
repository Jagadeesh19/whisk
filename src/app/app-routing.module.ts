import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AddEmployeeComponent} from "./add-employee/add-employee.component";
import {AdminEmployeesComponent} from "./admin-employees/admin-employees.component";
import {EmployeeComponent} from "./admin-employees/employee/employee.component";

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
    component: AdminEmployeesComponent,
    children:[
      {
        path:":id",
        component:EmployeeComponent
      }
    ],
    runGuardsAndResolvers: "always"
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
