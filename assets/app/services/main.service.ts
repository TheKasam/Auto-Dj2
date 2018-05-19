import { Injectable } from "@angular/core";
import { Http, Headers, Response} from "@angular/http";
import {HttpParams} from "@angular/common/http";

import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Playlist } from "../playlists/playlist.model";

@Injectable()
export class MainService {
    constructor(private http: Http) {}


    playlists: Playlist[] = [];
    access_token: string = "";


    getPlaylists(authId,userId){
        let params = new HttpParams().set("authId",authId).set("userID",userId);
        const headers = new Headers({'Content-Type': 'application/json'});

        return this.http.get('http://localhost:3000/spotify/getplaylists', {headers: headers, params: params})
            .map((response: Response) => {
                const playlistFetch = response.json().obj;
                let playlists: Playlist[] = [];
                for (let playlist of playlistFetch) {
                    this.playlists.push(new Playlist(
                        playlist.id,
                        playlist.name
                        )
                    );
                }
                return this.playlists;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }
    getAccessToken(userID: string){
        console.log("Get acces token");
        let params = new HttpParams().set("id",userID) //Create new HttpParams
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get('http://localhost:3000/user/getAccessToken', {headers: headers, params: params})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    addPlaylist(playlist: string){
        // this.playlists.push(playlist);
    }
    addButtonOption(token: string){
        this.access_token = token;
    }
    
}