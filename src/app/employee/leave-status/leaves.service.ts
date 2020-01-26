import {Injectable} from "@angular/core";

import {LeaveModel} from "./leave.model";
import {AuthService} from "../../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {domain_name} from "../../server.config";

@Injectable()
export class LeavesService {
  private leaves:LeaveModel[];
  private employeeId:string;
  private leavesListener=new Subject<LeaveModel[]>();

  constructor(
    private authService:AuthService,
    private http:HttpClient
  ) {

    this.employeeId=this.authService.getUserId();
  }

  fetchLeaves(leaveType,year,month){
    this.http.post<{leaves:LeaveModel[]}>(domain_name+"/api/employee/leaves",{
      employeeId:this.employeeId,
      leaveType:leaveType,
      year:year,
      month:month
    })
      .subscribe(
        response=>{
          this.leaves=response.leaves;
          this.leavesListener.next(this.leaves);
        }
      )
  }

  getLeavesListener(){
    return this.leavesListener.asObservable();
  }

}
