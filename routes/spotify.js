var express = require('express');
var router = express.Router();
var Spotify = require('spotify-web-api-js');

router.get('/getplaylists', function (req, res, next) {
    var json = body;
    var spotifyApi = new Spotify();

    spotifyApi.setAccessToken(access_token);

    spotifyApi.getUserPlaylists(json["id"], function(err, data) {

        if (err) console.error('err',err);
        //else console.log( data['items'][1]);
        var namedict = {};

        data["items"].forEach(function(item){
          var itemurl = item["uri"].split(":");
          namedict[item["name"]] = itemurl[4];
        });

        console.log(namedict);
      });
});

module.exports = router;
