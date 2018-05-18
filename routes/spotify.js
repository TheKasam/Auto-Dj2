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

    spotifyApi.getUserPlaylists(userId,{ limit: 10, offset: 20 }, function(err, data) {

        

        if (err) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
        }
        console.log(data.body);
        // var playlistsArray = {};
        // console.log(data);
        // data["items"].forEach(function(item){
        //   var itemurl = item["uri"].split(":");
        //   playlistsArray[item["name"]] = itemurl[4];
        // });

        // console.log(playlistsArray);

        // res.status(200).json({
        //   message: 'Success',
        //   obj: playlistsArray
        // });

    });
});

module.exports = router;