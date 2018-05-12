
console.log("pls");
var express = require('express');
var router = express.Router();

var client_id = '4cb3656b80e04fd39c6ee1842098914e'; // Your client id
var client_secret = '1c58e01a3b9748ce9fddbf3801aa55ed'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
var stateKey = 'spotify_auth_state';
var querystring = require('querystring');


router.get('/', function (req, res, next) {
      // your application requests authorization
  console.log("pls2");    
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

module.exports = router;
