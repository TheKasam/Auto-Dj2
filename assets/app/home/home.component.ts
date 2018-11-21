import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { MainService } from "../services/main.service";
import {Router} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService, private mainService: MainService,  private router: Router) { }

  ngOnInit() {
    if (this.router.url != "/" && this.router.url != "/home"){
      this.id = this.router.url.substring(2,this.router.url.length);
      console.log("router url");
      console.log(this.router.url);

      // console.log(JSON.parse(this.router.url.substring(4, -4)));
      this.onSubmit(this.id);
    }
  }

  //Executes on init. Used as part of authentication after spotify button is clicked. Spotify returns user code I need to pass to this page to store.
  id: string = "";
  onSubmit(id) {
    console.log(this.id)
    this.authService.getToken(id)
        .subscribe(
            data => {
                localStorage.setItem('token', data.token);
                console.log("set token");
                console.log(data.token);
                localStorage.setItem('userId', data.userId);
                this.router.navigate(['playlists']);
                //go to playlists
            },
            error => console.error(error)
        );
  }

  //Mark:- Guest Enters Code
  //Properties
  inputCode = ''
  //take input
  onSubmitCode(){
    console.log(this.inputCode);
    //prob: Should this function be made asyc?
    //prob: Log user out if logged in
    this.mainService.setGuestCode(this.inputCode);
    this.router.navigate(['vote']);

  }
  
}
