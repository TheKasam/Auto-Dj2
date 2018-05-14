import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import {Router} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  bob = 'bob';
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.router.url != "/" && this.router.url != "/home"){
      this.id = this.router.url.substring(2,this.router.url.length);
      console.log(this.router.url);

      // console.log(JSON.parse(this.router.url.substring(4, -4)));
      this.onSubmit();
    }
  }

  id: string = "";
  onSubmit() {
    console.log(this.id)
    this.authService.getToken(this.id)
        .subscribe(
            data => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                this.router.navigate(['playlists']);
                //go to playlists
            },
            error => console.error(error)
        );
  }
  
}
