
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
  
          var access_token = body.access_token, refresh_token = body.refresh_token;
          console.log("token");
          console.log(access_token);
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {

            res.locals.body = body;
            // return next();
            //Mark:- Register if not already a user
            var name = body.display_name;
            var email = body.email;
            var userId = body.id;
            var user = new User({
              firstName: name,
              email: email,
              pass_id: bcrypt.hashSync(userId, 10),
              access_token: access_token,
              refresh_token: refresh_token
          });

          
          User.findOne({email: email}, function(err, user) {
            if (err) {
                console.log("error occurred");
                console.log(err);
                
            }
            else if (!user) {
              user.save(function(err, result) {
                if (err) {
                  return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                  });  
                }
                else {
                  console.log("created user");
                  res.redirect('/#' + user._id.toString());

                }
              });
            } 
            else {
              console.log('user exists');
              console.log(user);
              user.access_token = access_token;
              user.refresh_token = refresh_token;
              user.save(function (err, result) {
                  if (err) {
                      return res.status(500).json({
                          title: 'An error occurred',
                          error: err
                      });
                  }
                  console.log("updated message");
              });
              res.redirect('/#' + user._id.toString());
            }
          });
          

          // var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
          // res.status(200).json({
          //     message: 'Successfully logged in',
          //     token: token,
          //     userId: user._id
          // });
              
          console.log(body);
          // res.redirect("http://localhost:3000/playlists");


          });
  
          // we can also pass the token to the browser to make requests from there
         

        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  });

router.post('/getToken', function(req, res, next) {
    //check if user exists
    console.log();
    console.log("getToken");
    console.log(req.body.id);
    User.findOne({_id: req.body.id}, function(err, user) {
      if (err) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
      }
      if (!user) {

          return res.status(401).json({
              title: 'Login failed',
              error: {message: 'user not found'}
          });
      }
      // if (!bcrypt.compareSync(req.body.password, user.password)) {
      //     return res.status(401).json({
      //         title: 'Login failed',
      //         error: {message: 'Invalid login credentials'}
      //     });
      // }
      var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
      res.status(200).json({
          message: 'Successfully logged in',
          token: token,
          userId: user._id
      });
  });
});

router.get('/getAccessToken', function(req, res) {
  //check if user exists
  console.log();
  console.log("getaccessToken");
  // console.log(req.params("id"));
 

  console.log("donw");
  var id = JSON.parse(req.query.updates).value
  console.log(id);
  console.log(typeof id);

  User.findOne({_id: id}, function(err, user) {
    if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    }
    if (!user) {

        return res.status(401).json({
            title: 'Login failed',
            error: {message: 'user not found'}
        });
    }

    res.status(200).json({
        message: 'Successfully logged in',
        access_token: user.access_token
      });
  });
});
module.exports = router;
