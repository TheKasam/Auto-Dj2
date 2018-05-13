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
  }

  onSubmit() {
    this.authService.signin()
        .subscribe(
            data => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                //go to playlists
            },
            error => console.error(error)
        );
    this.router.navigate(['playlists']);
}
  
}
