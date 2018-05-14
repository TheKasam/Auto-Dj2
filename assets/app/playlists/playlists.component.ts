import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  constructor() { }

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
  }

  name = localStorage.getItem('userId');




  // localStorage.setItem('name', name);

}
