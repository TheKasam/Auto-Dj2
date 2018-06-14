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
  songsFromDB: Song[];
  code = this.randomCodeGenerator();
  randNum = Math.floor((Math.random() * 3) + 0);
  songs: Song[];
  //used to select random songs
  songsNumArr = [];
  current_songs: Song[] =[];
  current_songs_from_spotify: Song[] =[];
  getVotesLoopBool = false;
  already_called = false;

  
  getToken() {
    console.log(this.name);
    this.mainService.getAccessToken(this.name)
      .subscribe(
          data => {
              console.log("access token");
              console.log(data.access_token);
              this.accessToken = data.access_token;
              this.getCurrentSongs();
          },
          error => console.error(error)
      );
  }

  async getCurrentSongs(){
    await this.getVotes();
    
    await this.retrieveSongs();
  
    await this.playFirstSong();
  }

  getVotes(){
    return new Promise(resolve => {
      setTimeout(() => {
        this.mainService.getVotes(this.name)
        .subscribe(
          data => {
            this.songsFromDB = data;
            console.log(this.songsFromDB);
          },
          error => console.log(error)
        );

              
        resolve();
      }, 1);
    });
  }

  playFirstSong(){
    return new Promise(resolve => {
      setTimeout(() => {

        var decision_factor = this.mainService.returnDecisionFactor();
        if(true){ //decision_factor == false


          //saves stuff in main.service
          this.mainService.getUser()
          .subscribe(
            
            data => {
              console.log(data);
              this.mainService.playFirstSong(this.accessToken)
              .subscribe(
                data => {console.log(data)
                  var playurl = "https://open.spotify.com/user/"+data.userSpotifyID+"/playlist/"+data.autodjid;
                  window.open(playurl, "_blank");
                },
                error => console.error(error)
              );
            },

            error => console.error(error)
          );
        }
        this.already_called = true;

        
        
        resolve();
      }, 1);
    });

    
  }

  retrieveSongs(){
    return new Promise(resolve => {
      setTimeout(() => {
        if(this.songsFromDB.length == 0){
          this.getSongs(this.accessToken, this.name);
          resolve();
        }
        else{
          this.current_songs = this.songsFromDB;
          resolve();
        }
      }, 500);
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
      this.current_songs_from_spotify.push(this.songs[this.songsNumArr[randNum]]);
      this.songsNumArr.splice(randNum,1);   
    
    }
    this.pushSongs();
  
  }

  pushSongs(){
    this.mainService.pushToCurrentSongs(this.current_songs_from_spotify[0],this.name)
    .subscribe(
      data => console.log(data),
      error => console.error(error)
    );   
    this.mainService.pushToCurrentSongs(this.current_songs_from_spotify[1],this.name)
    .subscribe(
      data => console.log(data),
      error => console.error(error)
    );   
    this.mainService.pushToCurrentSongs(this.current_songs_from_spotify[2],this.name)
    .subscribe(
      data => {
        console.log(data);
        this.getCurrentSongs();

       
      },
      error => console.error(error)
    );   
    
  }
  
  buttons = ["white","white","white"]
  setCurrentButton(index){
    var found = false;
    for (var i=0; i<3; i++) {
      if (this.buttons[i]=="green"){
        console.log(i);
        this.subtractVote(this.current_songs[i].id)
        found = true
      }
    }
    if (found == false){
      this.getCurrentSongs();

    }
    

    if (index == 0){
      this.buttons[0] = "green"
      this.buttons[1] = "white"
      this.buttons[2] = "white"
    }
    else if (index == 1){
      this.buttons[0] = "white"
      this.buttons[1] = "green"
      this.buttons[2] = "white"
    }
    else if (index == 2){
      this.buttons[0] = "white"
      this.buttons[1] = "white"
      this.buttons[2] = "green"
    }
  }

  updateVotes(songID,index){
    this.mainService.updateSongVote(songID)
    .subscribe(
      data => {
        console.log(data);
        
        this.setCurrentButton(index);
      },
      error => console.log(error)
    );
  }
  subtractVote(songID){
    this.mainService.subtractSongVote(songID)
    .subscribe(
      data => {
        console.log(data);
        this.getCurrentSongs();
      },
      error => console.log(error)
    );
  }

  getVotesLoop(){
    for(var i=0; i<-1;i++){
      this.mainService.getVotes(this.name)
      .subscribe(
        data => {
          this.songsFromDB = data;
          console.log(this.songsFromDB);
        },
        error => console.log(error)
      );
      this.getVotesLoopBool = true
    }
}
}
