import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LeavesService} from "../leaves.service";
import {Observable, Subject, Subscription} from "rxjs";
import {LeaveModel} from "../leave.model";

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent implements OnInit,OnDestroy {
  isLoading=true;
  employeeId:string;
  year:number;
  month:string;
  leaveType:string;
  leavesListener:Observable<LeaveModel[]>
  leavesSubscription:Subscription;
  leaves:LeaveModel[];

  constructor(
    private route:ActivatedRoute,
    private leavesService:LeavesService
  ) { }

  ngOnInit() {
    this.leavesListener=this.leavesService.getLeavesListener();

    this.route.queryParams.subscribe(
      queryParams=>{
        this.year=queryParams.year;
        this.month=queryParams.month;
        this.leavesService.fetchLeaves(this.leaveType,this.year,this.month);
        this.isLoading=true;
      }
    )

    this.route.params.subscribe(
      params=>{
        this.leaveType=params.leaveType;
        this.leavesService.fetchLeaves(this.leaveType,this.year,this.month);
        this.isLoading=true;
      }
    )



    this.leavesSubscription=this.leavesListener.subscribe(
      leaves=>{
        console.log(leaves);
        this.isLoading=false;
        this.leaves=leaves;
      }
    )
  }

  ngOnDestroy(): void {
    this.leavesSubscription.unsubscribe();
  }

}
