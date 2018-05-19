var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
var jwt = require('jsonwebtoken');


var request = require('request');
var User = require('../models/user');
var Playlist = require('../models/playlist');

router.get('/getAccessToken', function(req, res) {
    //check if user exists

    var id = JSON.parse(req.query.updates).value
    console.log(id);

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

router.use('/', function (req, res, next) {
    console.log("Start");
    console.log(req.body.params.updates[1].value);
    var token = req.body.params.updates[1].value
    jwt.verify(token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        console.log("token");
        console.log(token);
        next();
    })
});



router.post('/setCurrentPlaylist', function (req, res, next) {
    var token = JSON.parse(req.query.updates[1]).value
    var playlist = JSON.parse(req.query.updates[0]).value
    var id = JSON.parse(req.query.updates[2]).value

    var decoded = jwt.decode(token);
    User.findById(id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!user) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: {message: 'Message not found'}
            });
        }
        if (user._id != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        }
        var playlist = new Playlist({
            name: playlist.name,
            id: playlist.id,
            user: user
        });
        playlist.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            user.current_playlist = result;
            user.save();
            res.status(201).json({
                message: 'Saved playlist',
                obj: result
            });
            
        });
    });
});



  module.exports = router;