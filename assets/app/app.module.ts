import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from "@angular/http";
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from "./app.component";
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { VoteComponent } from './vote/vote.component';

import { AuthService } from "./auth.service";


const appRoutes: Routes =  [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'playlists', component: PlaylistsComponent},
    {path: 'vote', component: VoteComponent}
  ];

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        PlaylistsComponent,
        VoteComponent
    ],
    imports: [BrowserModule, RouterModule.forRoot(appRoutes),HttpModule,HttpClientModule],
    providers: [AuthService],
    bootstrap: [AppComponent]
})
export class AppModule {

}