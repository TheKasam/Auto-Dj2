import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // var json = body;
    // var spotifyApi = new Spotify();

    // spotifyApi.setAccessToken(access_token);

    // spotifyApi.getUserPlaylists(json["id"], function(err, data) {

    //     if (err) console.error('err',err);
    //     //else console.log( data['items'][1]);
    //     var namedict = {};

    //     data["items"].forEach(function(item){
    //       var itemurl = item["uri"].split(":");
    //       namedict[item["name"]] = itemurl[4];
    //     });

    //     console.log(namedict);
    //   });
    var name = localStorage.getItem('userId');

    this.onSubmit() 
 }
  accessToken = "";

  name = localStorage.getItem('userId');
  onSubmit() {
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
