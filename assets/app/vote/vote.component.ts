import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { MainService } from "../services/main.service";
import {Router} from '@angular/router';


@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

  constructor(private router: Router, private mainService: MainService) { }

  ngOnInit() {
    this.code  = this.randomCodeGenerator()
    this.name = localStorage.getItem('userId');
    this.setCode(this.code);
  }
  name = "bob";
  current_songs = ["molly","fear","psycho"]
  code = "bob342";

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
      //navigate to vote page
      // this.router.navigate(['vote']);
  }

}
