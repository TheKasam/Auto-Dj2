
export class MainService {


    playlists: string[] = [];
    access_token: string = "";


    getPlaylists(){
        return this.playlists;
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