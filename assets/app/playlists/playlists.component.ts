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
    this.start();
    
  }
  
  async start(){
    await this.getToken();
    // await this.getPlaylists(this.accessToken,this.name);
    // await this.printlol();
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

  printlol(){
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(this.accessToken, "pls");
        resolve();
      }, 1);
    });
  }


  getToken() {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(this.name)
        this.authService.getAccessToken(this.name)
          .subscribe(
              data => {
                  console.log("access token");
                  console.log(data.access_token);
                  this.accessToken = data.access_token;
                  this.getPlaylists(this.accessToken, name);
                  //go to playlists
              },
              error => console.error(error)
           );

        resolve();
      }, 1);
    });


    
  }

  // localStorage.setItem('name', name);

}
