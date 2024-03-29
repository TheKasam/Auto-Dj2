import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { MainService } from "../services/main.service";
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
    //async function
    this.start();

  }

  //Mark:- Variables
  accessToken = "";
  name = "bob";
  playlists: Playlist[];



  async start(){
    await this.getUserId();

    await this.getToken();

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
  getToken() {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(this.name)
        this.mainService.getAccessToken(this.name)
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
  //called in get Token
  getPlaylists(accessToken,userId){
    this.mainService.getPlaylists(accessToken,userId)
    .subscribe(
        (playlistsArr: Playlist[]) => {
            this.playlists = playlistsArr;
            this.update();
        }
    );
  }


  selectPlaylist(playlist){
    //set as current playlistfor user
    this.mainService.updateCurrentPlaylist(playlist,this.name)
      .subscribe(
        data => {
          console.log(data);

              //navigate to vote page
        },
        error => console.error(error)
      );
      console.log(playlist.id);
      //navigate to vote page
      this.router.navigate(['vote']);

  }

  update(){
    var ifCreate = true;
    for(var i = 0; i < this.playlists.length; i++){
      if(this.playlists[i].name == "AutoDJPlaylist"){
        ifCreate = false;
      }
    }
    if(ifCreate){
      this.mainService.createDJPlaylist(this.accessToken)
      .subscribe(
        data => {
          console.log(data)
          console.log("updateCurrentPlaylist");
          console.log(data);
          //set as current playlistfor user
          this.mainService.setSpotifyCodeID(data,this.name)
            .subscribe(
              data => {
                console.log("setSpotifyCodeID");
                console.log(data)},
              error => console.error(error)
            );
          },
        error => console.log(error)
      );
    }
  }
  // localStorage.setItem('name', name);

}
