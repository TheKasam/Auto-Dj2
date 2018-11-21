import { Injectable } from "@angular/core";
import { Http, Headers, Response} from "@angular/http";
import {HttpParams} from "@angular/common/http";

import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Playlist } from "../playlists/playlist.model";
import { Song } from "../vote/song.model";

@Injectable()
export class MainService {

    constructor(private http: Http) {}

    playlists: Playlist[] = [];
    songs: Song[] = [];
    access_token: string = "";
    decision_factor = false;
    current_playlist_id = "";
    current_playlist_id2 = "";
    autodj_playlist_id = "";
    //code guest uses to access vote
    guestCode = "";

    //Gets playlists of logged in user
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

    getPlaylistSongs(authId,userId){
        let params = new HttpParams().set("authId",authId).set("userID",userId);
        const headers = new Headers({'Content-Type': 'application/json'});

        return this.http.get('http://localhost:3000/spotify/getplaylistSongs', {headers: headers, params: params})
            .map((response: Response) => {
                const songsFetch = response.json().obj;
                let songsToGet: Song[] = [];
                for (let song of songsFetch) {
                    this.songs.push(new Song(
                        song.id,
                        song.name,
                        0
                        )
                    );
                }

                return this.songs;
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

    updateCurrentPlaylist(playlist: Playlist, userID: String) {

        const headers = new Headers({'Content-Type': 'application/json'});
        const playlistStringify = JSON.stringify(playlist);
        const token = localStorage.getItem('token')
            ? '' + localStorage.getItem('token')
            : '';
            // ? '?token=' + localStorage.getItem('token')
            // : '';
        let params = new HttpParams().set("playlist",playlistStringify).set("token",token).set("id",String(userID));
        return this.http.post('http://localhost:3000/user/setCurrentPlaylist', {headers: headers, params: params})
            .map((response: Response) => {
                this.decision_factor = response.json().decision;
                console.log("decision",this.decision_factor);
                this.current_playlist_id = response.json().playlist_id;
                return response.json().decision
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    //Set guest user code
    setGuestCode(code: string){
        this.guestCode = code;
    }

    //Sets vote code for current user
    setCode(code: String, userID: String){
        const headers = new Headers({'Content-Type': 'application/json'});
        const codeStringify = JSON.stringify(code);
        const token = localStorage.getItem('token')
            ? '' + localStorage.getItem('token')
            : '';

        let params = new HttpParams().set("code",codeStringify).set("token",token).set("id",String(userID));
        return this.http.post('http://localhost:3000/user/setShareableCode', {headers: headers, params: params})
            .map((response: Response) => {
                return response.json().message})
            .catch((error: Response) => Observable.throw(error.json()));
    }

    //saves auto dj playlist id to user object in db
    setSpotifyCodeID(sId: String, userID: String){
        const headers = new Headers({'Content-Type': 'application/json'});
        const spotifyID = JSON.stringify(sId);
        const token = localStorage.getItem('token')
            ? '' + localStorage.getItem('token')
            : '';

        let params = new HttpParams().set("spotifyID",spotifyID).set("token",token).set("id",String(userID));
        return this.http.post('http://localhost:3000/user/setSpotifyCodeID', {headers: headers, params: params})
            .map((response: Response) => {
                return response.json().obj})
            .catch((error: Response) => Observable.throw(error.json()));
    }

    pushToCurrentSongs(song: Song, userID: String){
        console.log("calling push songs");

        const headers = new Headers({'Content-Type': 'application/json'});
        const songStringify = JSON.stringify(song);
        const token = localStorage.getItem('token')
            ? '' + localStorage.getItem('token')
            : '';

        let params = new HttpParams().set("song",songStringify).set("token",token).set("id",String(userID));
        return this.http.post('http://localhost:3000/user/pushToCurrentSongs', {headers: headers, params: params})
            .map((response: Response) => {
                return response.json().message})
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getVotes(userID: string){
        console.log("Get votes");
        const token = localStorage.getItem('token')
            ? '' + localStorage.getItem('token')
            : '';
        let params = new HttpParams().set("id",userID).set("token",token); //Create new HttpParams
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get('http://localhost:3000/user/getSongVote', {headers: headers, params: params})
            .map((response: Response) => {
                const songsFetch = response.json().obj;
                let songsToReturn: Song[] = [];
                for (let song of songsFetch) {
                    songsToReturn.push(new Song(
                        song._id,
                        song.name,
                        song.votes
                        )
                    );
                }
                return songsToReturn;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getUser(){
        console.log("Get User");
        const userID: string = localStorage.getItem('userId');
        console.log(userID);
        const token = localStorage.getItem('token')
            ? '' + localStorage.getItem('token')
            : '';
        let params = new HttpParams().set("id",userID).set("token",token); //Create new HttpParams
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get('http://localhost:3000/user/getUser', {headers: headers, params: params})
            .map((response: Response) => {
                const user = response.json().obj;
                console.log("logging user")
                console.log(user);
                this.current_playlist_id = user.current_playlist;
                this.autodj_playlist_id = user.autodj_playlist_id;
                return user;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    updateSongVote(songID: string){
        console.log("calling push songs");
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '' + localStorage.getItem('token')
            : '';

        let params = new HttpParams().set("songID",songID).set("token",token);
        return this.http.post('http://localhost:3000/user/updateVote', {headers: headers, params: params})
            .map((response: Response) => {
                return response.json().message})
            .catch((error: Response) => Observable.throw(error.json()));
    }

    subtractSongVote(songID: string){
        console.log("calling push songs");

        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '' + localStorage.getItem('token')
            : '';

        let params = new HttpParams().set("songID",songID).set("token",token);
        return this.http.post('http://localhost:3000/user/subtractVote', {headers: headers, params: params})
            .map((response: Response) => {
                return response.json().message})
            .catch((error: Response) => Observable.throw(error.json()));
    }

    createDJPlaylist(accesstoken: string){
        console.log("creating the DJ playlist");
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
        ? '' + localStorage.getItem('token')
        : '';
        let params = new HttpParams().set("accesstoken",accesstoken).set("token",token);
        return this.http.post('http://localhost:3000/spotify/createDJPlaylist', {headers: headers, params: params})
            .map((response: Response) => {
                return response.json().autodj_playlist_id})
            .catch((error: Response) => Observable.throw(error.json()));
    }

    returnDecisionFactor(){
        return this.decision_factor;
    }

    playFirstSong(accesstoken: string){
        console.log("playing first song");
        console.log('hide');
        console.log("this.current_playlist_id");
        console.log(this.current_playlist_id);

        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '' + localStorage.getItem('token')
            : '';
        let params = new HttpParams().set("accesstoken",accesstoken).set("playlistid",this.current_playlist_id).set("autodjid",this.autodj_playlist_id);
        return this.http.post('http://localhost:3000/spotify/playFirstSong', {headers: headers, params: params})
              .map((response: Response) => {return response.json()})
              .catch((error: Response) => Observable.throw(error.json()));
        }
}
