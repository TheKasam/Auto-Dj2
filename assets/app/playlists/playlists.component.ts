import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { MainService } from "../main.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private mainService: MainService) { }

  ngOnInit() {
    this.getToken() 
    this.getPlaylists(this.accessToken,this.name)
    console.log(this.playlists);
  }
  
  //Mark:- Variables
  accessToken = "";
  name = localStorage.getItem('userId');
  playlists: string[];

  getPlaylists(accessToken,userId){
    this.mainService.getPlaylists(accessToken,userId)
    .subscribe(
        (playlistsArr: string[]) => {
            this.playlists = playlistsArr;
        }
    );
  }


  getToken() {
    console.log(this.name)
    this.authService.getAccessToken(this.name)
      .subscribe(
          data => {
              this.accessToken = data.access_token;
              
              //go to playlists
          },
          error => console.error(error)
       );
  }

  // localStorage.setItem('name', name);

}
