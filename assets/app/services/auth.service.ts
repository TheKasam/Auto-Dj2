import { Injectable } from "@angular/core";
import { Http, Headers, Response} from "@angular/http";
import {HttpParams} from "@angular/common/http";

import 'rxjs/Rx';
import { Observable } from "rxjs";


@Injectable()
export class AuthService {
    constructor(private http: Http) {}

    getToken(userID: string) {
        const body = {id: userID};
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/login/getToken', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }


    logout() {
        localStorage.clear();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }
}