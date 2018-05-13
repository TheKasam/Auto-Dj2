
console.log("pls");
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var Spotify = require('spotify-web-api-js');

var client_id = '356fadb6961741c1ba6aac9966edbcbf'; // Your client id
var client_secret = 'f3b9982a3e3347bfa60263d1d50fbbc2'; // Your secret
var redirect_uri = 'http://localhost:3000/login/callback'; // Your redirect uri

var User = require('../models/user');

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '../assets'))
   .use(cookieParser());

router.get('/', function (req, res, next) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    var scope = 'user-read-private user-read-email user-read-currently-playing user-modify-playback-state user-read-playback-state streaming playlist-read-private playlist-modify-private playlist-modify-public playlist-read-collaborative';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
});


router.get('/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter
  
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
  
    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } 
    else {

      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
  
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
  
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
  
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body);


            //register if not already a user
            var name = body.display_name;
            var email = body.email;
            var userId = body.id;
            console.log("auth code");
            console.log(userId);

            User.findOne({email: email}, function(err, user) {
              if (err) {
                console.log(err);

                  return res.status(500).json({
                      title: 'An error occurred',
                      error: err
                  });
              }
              if (!user) {
                console.log("fail two");
                  return res.status(401).json({
                      title: 'Login failed',
                      error: {message: 'Invalid login credentials'}
                  });
              }
              if (!bcrypt.compareSync(req.body.password, user.password)) {
                console.log("fail three");
                  return res.status(401).json({
                      title: 'Login failed',
                      error: {message: 'Invalid login credentials'}
                  });
              }
              console.log("wored!!!");
              var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
              res.status(200).json({
                  message: 'Successfully logged in',
                  token: token,
                  userId: user._id
              });
          });



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
  
          // we can also pass the token to the browser to make requests from there
          res.redirect("http://localhost:3000/playlists");


        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  });

module.exports = router;
