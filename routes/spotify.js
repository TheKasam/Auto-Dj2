var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
var User = require('../models/user');
var Playlist = require('../models/playlist');


router.get('/getplaylists', function(req, res, next) {

    var authId = JSON.parse(req.query.updates[0]).value

    var userId = JSON.parse(req.query.updates[1]).value

    var client_id = '356fadb6961741c1ba6aac9966edbcbf'; // Your client id
    var client_secret = 'f3b9982a3e3347bfa60263d1d50fbbc2'; // Your secret
    var redirect_uri = 'http://localhost:3000/login/callback'; // Your redirect uri

    var spotifyApi = new SpotifyWebApi({
        clientId: client_id,
        clientSecret: client_secret,
        redirectUri: redirect_uri
    });

    spotifyApi.setAccessToken(authId);
    spotifyApi.getMe(function(err, data) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        console.log(data.body);

        spotifyApi.getUserPlaylists(data.body.id, {
            limit: 30,
            offset: 0
        }, function(err, data) {

            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            var playlistsArray = [];

            data.body["items"].forEach(function(item) {
                var name = item.name;
                var id = item.id;
                playlistsArray.push({
                    id: id,
                    name: name
                });
            });
            console.log("playlistsArray");

            console.log(playlistsArray);

            res.status(200).json({
                message: 'Success',
                obj: playlistsArray
            });
        });
    });
});

router.get('/getplaylistSongs', function(req, res, next) {

    var authId = JSON.parse(req.query.updates[0]).value

    var userId = JSON.parse(req.query.updates[1]).value

    var client_id = '356fadb6961741c1ba6aac9966edbcbf'; // Your client id
    var client_secret = 'f3b9982a3e3347bfa60263d1d50fbbc2'; // Your secret
    var redirect_uri = 'http://localhost:3000/login/callback'; // Your redirect uri

    var spotifyApi = new SpotifyWebApi({
        clientId: client_id,
        clientSecret: client_secret,
        redirectUri: redirect_uri
    });

    spotifyApi.setAccessToken(authId);
    spotifyApi.getMe(function(err, data) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        console.log(data.body);
        console.log("plays id");

        Playlist.findOne({
            user: userId
        }, function(err, playlist) {
            console.log("playlist result");
            console.log(playlist);
            console.log("iser id");
            console.log(data.body.id);

            spotifyApi.getPlaylist(data.body.id, playlist.id, {
                limit: 10,
                offset: 0
            }, function(err, data) {

                console.log("inside");
                console.log(err);
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }

                var playlistsArray = [];

                data.body.tracks.items.forEach(function(item) {
                    console.log("track");
                    console.log(item.track.id);
                    var name = item.track.name;
                    var id = item.track.id;
                    playlistsArray.push({
                        id: id,
                        name: name
                    });
                });
                console.log("playlistsArray");

                console.log(playlistsArray);

                res.status(200).json({
                    message: 'Success',
                    obj: playlistsArray
                });
            }); // end of spotify get
        }); //end of plyalist
    });
});

router.post('/createDJPlaylist', function(req, res, next){
    console.log("creating DJ Playlist");
    console.log(req.body.params.updates[0].value);
    var accesstoken = req.body.params.updates[0].value;
    var token = req.body.params.updates[1].value;
    var client_id = '356fadb6961741c1ba6aac9966edbcbf'; // Your client id
    var client_secret = 'f3b9982a3e3347bfa60263d1d50fbbc2'; // Your secret
    var redirect_uri = 'http://localhost:3000/login/callback'; // Your redirect uri

    var spotifyApi = new SpotifyWebApi({
        clientId: client_id,
        clientSecret: client_secret,
        redirectUri: redirect_uri
    });
    spotifyApi.setAccessToken(accesstoken);
    spotifyApi.getMe(function(err, data) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        console.log(data);
        spotifyApi.createPlaylist(data.body.id, "AutoDJPlaylist", function(err, data){
            console.log("createPlaylist inside");
            console.log(data.body);
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Successfully created DJ playlist',
                autodj_playlist_id: data.body.id
            });
        });
    });  
});

router.post('/playFirstSong', function(req, res, next){
    console.log("adding to AutoDJ playlist and playing random");
    console.log(req.body.params.updates);
    var accesstoken = req.body.params.updates[0].value;
    var playlist_id = req.body.params.updates[1].value;
    var autodj_id = req.body.params.updates[2].value;


    var client_id = '356fadb6961741c1ba6aac9966edbcbf'; // Your client id
    var client_secret = 'f3b9982a3e3347bfa60263d1d50fbbc2'; // Your secret
    var redirect_uri = 'http://localhost:3000/login/callback'; // Your redirect uri

    var spotifyApi = new SpotifyWebApi({
        clientId: client_id,
        clientSecret: client_secret,
        redirectUri: redirect_uri
    });
    spotifyApi.setAccessToken(accesstoken);
    spotifyApi.getMe(function(err, data) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        console.log("user data");

        console.log(data);
        console.log(playlist_id);

        var userSpotifyID = data.body.id
        Playlist.findOne({
            _id: playlist_id
        }, function(err, playlist) {
        

            spotifyApi.getPlaylist(userSpotifyID, playlist.id, {
                limit: 10,
                offset: 0
            }, function(err, data) {
    
                console.log("inside");
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
    
                var playlistsArray = [];
    
                data.body.tracks.items.forEach(function(item) {
                    console.log("track");
                    console.log(item.track.id);
                    var name = item.track.name;
                    var id = item.track.id;
                    playlistsArray.push({
                        id: id,
                        name: name
                    });
                });
                console.log("playlistsArray");
    
                console.log(playlistsArray);
                var songid = playlistsArray[0].id
                

                spotifyApi.addTracksToPlaylist(userSpotifyID, autodj_id, ["spotify:track:"+songid], {
                    position : 0
                }, function(err, data) {
        
                }); // end of addTracksToPlaylist 

                var autoUri = 'spotify:user:'+userSpotifyID+"playlist:"+autodj_id;
                spotifyApi.play({context_uri: "spotify:user:6220ecortl2kdhvliq37igyil:playlist:"+autodj_id}, 
                function(err, data) {
        
                }); // end of addTracksToPlaylist 



                res.status(200).json({
                    message: 'Success',
                    obj: playlistsArray,
                    spotifyUserId:userSpotifyID,
                    autodjid: autodj_id
                });
            }); // end of spotify get





        });
 


       
    });  
});

module.exports = router;