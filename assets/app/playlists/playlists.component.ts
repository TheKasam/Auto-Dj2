import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { MainService } from "../main.service";
import {Router} from '@angular/router';

import { Playlist } from "./playlist.model";


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
  
  //Mark:- Variables
  accessToken = "";
  name = "bob";
  playlists: Playlist[];

  async start(){
    await this.getUserId();
    
    await this.getToken();
    // await this.getPlaylists(this.accessToken,this.name);
    // await this.printlol();
  }
  getUserId(){
    return new Promise(resolve => {
      setTimeout(() => {
        this.name = localStorage.getItem('userId');
        console.log("name",this.name);
        resolve();
      }, 1);
    });
  }


  getPlaylists(accessToken,userId){
    this.mainService.getPlaylists(accessToken,userId)
    .subscribe(
        (playlistsArr: Playlist[]) => {
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
                  this.getPlaylists(this.accessToken, this.name);
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
