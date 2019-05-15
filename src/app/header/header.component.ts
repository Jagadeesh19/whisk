import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";

import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit ,OnDestroy{
  navbarOpen:boolean=false;
  private authListenerSub:Subscription;
  isAuth:boolean=false;

  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.authListenerSub=this.authService.getAuthStatusListener()
      .subscribe((authStatus:boolean)=>{
        this.isAuth=authStatus;
      })
  }

  onNavbarToggle(){
    this.navbarOpen=(this.navbarOpen)?false:true;
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }

}
