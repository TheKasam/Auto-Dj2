var express = require('express');
var router = express.Router();
var Spotify = require('spotify-web-api-js');

router.get('/getplaylists', function (req, res, next) {
    var id = JSON.parse(req.query.updates);
    console.log(req.query.updates);

    var spotifyApi = new Spotify();

    spotifyApi.setAccessToken(access_token);

    spotifyApi.getUserPlaylists(json["id"], function(err, data) {

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