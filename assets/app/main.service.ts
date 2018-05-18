import { Injectable } from "@angular/core";
import { Http, Headers, Response} from "@angular/http";
import {HttpParams} from "@angular/common/http";

import 'rxjs/Rx';
import { Observable } from "rxjs";

@Injectable()
export class MainService {
    constructor(private http: Http) {}


    playlists: string[] = [];
    access_token: string = "";


    getPlaylists(authId,userId){
        let params = new HttpParams().set("authId",authId).set("userID",userId);
        const headers = new Headers({'Content-Type': 'application/json'});

        return this.http.get('http://localhost:3000/spotify/getplaylists', {headers: headers, params: params})
            .map((response: Response) => {
                const playlistFetch = response.json().obj;
                // let transformedMessages: Message[] = [];
                // for (let message of messages) {
                //     transformedMessages.push(new Message(
                //         message.content,
                //         message.user.firstName,
                //         message._id,
                //         message.user._id)
                //     );
                // }
                this.playlists = playlistFetch;
                return this.playlists
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }
    getAccessToken(){
        return this.access_token;
    }

    addPlaylist(playlist: string){
        this.playlists.push(playlist);
    }
    addButtonOption(token: string){
        this.access_token = token;
    }
    
}