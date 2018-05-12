
export class MainService {


    playlists: string[] = [];




    addPlaylist(playilst: string){
        this.playlists.push(playilst);
    }
    
    getPlaylists(){
        return this.playlists;
    }

    // trackButtonOption: number = 0;

    // getButtonOption(){
    //     return this.trackButtonOption;
    // }
    
    // addButtonOption(option: number){
    //     this.trackButtonOption = option;
    // }
    
}