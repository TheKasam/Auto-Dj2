import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { MainService } from "../services/main.service";
import {Router} from '@angular/router';

import { Song } from "./song.model";
import { exists } from 'fs';


@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

  constructor(private router: Router, private mainService: MainService) { }

  ngOnInit() {
    this.setCode(this.code);
    this.getToken();
  }

  accessToken = "";
  name = localStorage.getItem('userId');
  code = this.randomCodeGenerator();
  randNum = Math.floor((Math.random() * 3) + 0);
  songs: Song[];
  //used to select random songs
  songsNumArr = [];
  current_songs: Song[] =[];
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
                  this.getSongs(this.accessToken, this.name);
                  //go to playlists
              },
              error => console.error(error)
           );
        resolve();
      }, 1);
    });
  }

  randomCodeGenerator(){
    length = 5
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  setCode(code){
    //set as current playlistfor user
    this.mainService.setCode(code,this.name)
      .subscribe(
        data => console.log(data),
        error => console.error(error)
      );    
      console.log(code);
  
  }

  getSongs(accessToken,userId){
    this.mainService.getPlaylistSongs(accessToken,userId)
    .subscribe(
        (songs: Song[]) => {
            this.songs = songs;
            console.log(this.songs);
            this.selectSongs();
        }
    );
  }

  //check if value exists if so update else create

  //selects 3 random songs and store in current_songs
  selectSongs(){
    for (var i = 0; i < this.songs.length; i++){
      this.songsNumArr.push(i);

      
    }
    for (var i = 0; i < 3; i++){
      
      console.log(this.songsNumArr);
      var randNum = Math.floor((Math.random() * this.songsNumArr.length) + 0);
      console.log(randNum);
      console.log(this.songs[randNum]);
      this.current_songs.push(this.songs[this.songsNumArr[randNum]]);
      this.songsNumArr.splice(randNum,1);   
    
    }
    this.pushSong();
  }

  pushSong(){
    this.mainService.pushToCurrentSongs(this.songs[0],this.name)
    .subscribe(
      data => console.log(data),
      error => console.error(error)
    );   
    this.getVotes();
  }

  getVotes(){
    var returned;
    this.mainService.getVotes(this.name)
    .subscribe(
      data => {
        returned = data;
        console.log(data);
      },
      error => console.log(error)
    );
    if(returned.obj.length == 0){
      this.selectSongs();
    }
  }

}
