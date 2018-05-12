
export class MainService {


    playlists: string[] = [];
    access_token: string = "";


    getPlaylists(){
        return this.playlists;
    }
    getAccessToken(){
        return this.access_token;
    }

    addPlaylist(playilst: string){
        this.playlists.push(playilst);
    }
    addButtonOption(token: string){
        this.access_token = token;
    }
    
}