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
    //gets The Guest Code
    this.guestCode = this.mainService.getGuestCode();

    //If not guest code
    if (this.guestCode == ""){
      //sets the code to be shared with others
      this.code = this.randomCodeGenerator();
      this.setCode(this.code);
      //gets the spotify user authentication token
      this.getToken();
    } else {
      this.code = this.guestCode;
      console.log("this.code");
      console.log(this.code);
      this.getCurrentSongs();
    }

  }

  //guest properties
  guestCode = "";

  //logged user properties
  accessToken = "";
  name = localStorage.getItem('userId');

  songsFromDB: Song[];
  code = "";
  randNum = Math.floor((Math.random() * 3) + 0);
  songs: Song[];
  //used to select random songs
  songsNumArr = [];
  current_songs: Song[] =[];
  current_songs_from_spotify: Song[] =[];
  getVotesLoopBool = false;

  //gets the spotify user authentication token
  //sets the authentication token to this.access token
  //calls getCurrentSongs and playFirstSongMethod
  
  getToken() {
    console.log(this.name);
    this.mainService.getAccessToken(this.name)
      .subscribe(
          data => {
              console.log("access token");
              console.log(data.access_token);
              this.accessToken = data.access_token;
              setTimeout(() => {

                //async method that gets current votes for the 3 random songs
                this.getCurrentSongs();
                //if users spotify playlists chaged it stats playling the first song from the playlist
                this.playFirstSongMethod();        
                      
              }, 500);
          },
          error => console.error(error)
      );
  }

 
  async getCurrentSongs(){
    //sets the full object of the three songs to songsFromDB
    await this.getVotes();
    //if songsFromDB is empty it populates it
    await this.retrieveSongs();
  }

  //Mark:- This could probabaly be done better
  async playFirstSongMethod(){
    //playsFirstSong from playlist
    await this.playFirstSong();
  }

  getVotes(){
    return new Promise(resolve => {
      setTimeout(() => {

        this.mainService.getVotes(this.code).subscribe(
          data => {
            
            this.songsFromDB = data;
            console.log("songsfrom db");
            console.log(this.songsFromDB);
          },
          error => console.log(error)
        ); 
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

  playFirstSong(){
    return new Promise(resolve => {
      setTimeout(() => {

        var decision_factor = this.mainService.returnDecisionFactor();
        if(decision_factor == false){ 

          //Saves user details in main.service (configure what is saved in main.service)
          this.mainService.getUser().subscribe(   
            data => {
              //Starts Playing Song From Playlist
              this.mainService.playFirstSong(this.accessToken).subscribe(
                data => { console.log(data) // var playurl = "https://open.spotify.com/user/"+data.userSpotifyID+"/playlist/"+data.autodjid;  // window.open(playurl, "_blank");
                },
                error => console.error(error)
              );
            },
            error => console.error(error)
          );
        }
        resolve();

      }, 1);
    });
  }

  
  //Generates a Random Code
  randomCodeGenerator(){
    length = 5
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  //Sets Shareable Code
  setCode(code){
    this.mainService.setCode(code,this.name).subscribe(
        data => console.log(data),
        error => console.error(error)
      );      
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
      var randNum = Math.floor((Math.random() * this.songsNumArr.length) + 0); 
      this.current_songs_from_spotify.push(this.songs[this.songsNumArr[randNum]]);
      this.songsNumArr.splice(randNum,1);   
    }
    this.pushSongs();
  }

  //saves the three selected random songs to the database
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
  

  //Highlights the song you selected
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

  //Adds 1 to the selected song
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

  //Subtracts 1 to the selected song
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

  //to keep the votes added by other users updated to whats displayed for current user
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
