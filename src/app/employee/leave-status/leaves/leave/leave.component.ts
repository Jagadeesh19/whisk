import {Component, Input, OnInit} from '@angular/core';
import {LeaveModel} from "../../leave.model";

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements OnInit {
  @Input() leave:LeaveModel;
  detailedView=false;
  nofDays:number;

  constructor() { }

  ngOnInit() {
    this.leave.startDate=new Date(this.leave.startDate);
    this.leave.endDate=new Date(this.leave.endDate);
    this.nofDays=(this.leave.endDate-this.leave.startDate)/(3600000*24);
  }

}
