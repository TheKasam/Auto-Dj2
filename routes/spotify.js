var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');

router.get('/getplaylists', function (req, res, next) {

    var authId = JSON.parse(req.query.updates[0]).value

    var userId = JSON.parse(req.query.updates[1]).value

    var client_id = '356fadb6961741c1ba6aac9966edbcbf'; // Your client id
    var client_secret = 'f3b9982a3e3347bfa60263d1d50fbbc2'; // Your secret
    var redirect_uri = 'http://localhost:3000/login/callback'; // Your redirect uri

    var spotifyApi = new SpotifyWebApi({
      clientId: client_id,
      clientSecret: client_secret,
      redirectUri:redirect_uri
    });

    spotifyApi.setAccessToken(authId);
    spotifyApi.getMe( function(err, data) {
      if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
      }
      console.log(data.body);

      spotifyApi.getUserPlaylists(data.body.id,{ limit: 30, offset: 0 }, function(err, data) {

        

        if (err) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
        }
        
        var playlistsArray = [];
        
        data.body["items"].forEach(function(item){
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

module.exports = router;