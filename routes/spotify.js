var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');

router.get('/getplaylists', function (req, res, next) {
    console.log("query");
    console.log(req.query);
    var authId = JSON.parse(req.query.updates[0]);
    var userId = JSON.parse(req.query.updates[1]);


    var spotifyApi = new SpotifyWebApi({
      clientId: userId
        });
    spotifyApi.setAccessToken(authId);
    spotifyApi.getMe()
    .then(function(data) {
      console.log('Some information about the authenticated user', data.body);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
    // spotifyApi.getUserPlaylists("6220ecortl2kdhvliq37igyil",{ limit: 10, offset: 20 }, function(err, data) {

        

    //     if (err) {
    //       return res.status(500).json({
    //           title: 'An error occurred',
    //           error: err
    //       });
    //     }

    //     var playlistsArray = {};
    //     console.log(data);
    //     data["items"].forEach(function(item){
    //       var itemurl = item["uri"].split(":");
    //       playlistsArray[item["name"]] = itemurl[4];
    //     });

    //     console.log(playlistsArray);

    //     res.status(200).json({
    //       message: 'Success',
    //       obj: playlistsArray
    //     });

    // });
});

module.exports = router;