export class Song {
    id: string;
    name: string;
    votes: number;

    constructor(id: string, name: string, votes: number) {
        this.id = id;
        this.name = name;
        this.votes = votes;
    }
}
