var express = require('express');
var router = express.Router();
var Spotify = require('spotify-web-api-js');

router.get('/getplaylists', function (req, res, next) {
    console.log("query");
    console.log(req.query);
    var authId = JSON.parse(req.query.updates[0]);
    var userId = JSON.parse(req.query.updates[1]);


    var spotifyApi = new Spotify();

    spotifyApi.setAccessToken(authId);

    spotifyApi.getUserPlaylists(userId, function(err, data) {

        if (err) console.error('err',err);
        //else console.log( data['items'][1]);
        var playlistsArray = {};

        data["items"].forEach(function(item){
          var itemurl = item["uri"].split(":");
          playlistsArray[item["name"]] = itemurl[4];
        });

        console.log(playlistsArray);

        if (err) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: playlistsArray
        });

    });
});

module.exports = router;