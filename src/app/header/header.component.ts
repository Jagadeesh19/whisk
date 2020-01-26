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
  isAdmin:boolean;

  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.isAuth=this.authService.getAuthStatus();
    this.isAdmin=(this.authService.getUserType()==="admin");
    this.authListenerSub=this.authService.getAuthStatusListener()
      .subscribe((authStatus:boolean)=>{
        this.isAuth=authStatus;
        if (this.isAuth){
          this.isAdmin=(this.authService.getUserType()==="admin");
          console.log(this.isAdmin);
        }

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
