var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
var jwt = require('jsonwebtoken');


var request = require('request');
var User = require('../models/user');
var ShareableCode = require('../models/code');
var Playlist = require('../models/playlist');
var Song = require('../models/song');

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
        
        next();
    })
});

router.post('/setCurrentPlaylist', function (req, res, next) {
   
    var token = req.body.params.updates[1].value
    var playlist = req.body.params.updates[0].value
    var id = req.body.params.updates[2].value

    var decoded = jwt.decode(token);

    // var playlistToSave = new Playlist({
    //     name: JSON.parse(playlist).name,
    //     id: JSON.parse(playlist).id,
    //     user: user
    // });
    Playlist.findOneAndUpdate({user: id}, { name: JSON.parse(playlist).name, id:JSON.parse(playlist).id  }, {new: true, upsert:true}, function(err, result){
        if (err) {
            return res.status(500).json({
                title: 'An error occurred0',
                error: err
            });
        }
        
        User.findOne({_id: id}, function(err, user) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred0',
                    error: err
                });
            }
            user.current_playlist = result;
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        title: 'couldnt save occurred',
                        error: err
                    });
                }
                res.status(201).json({
                    message: 'Saved code',
                    obj: result
                }); 
            });
        });
        
    });
});

router.post('/setShareableCode', function (req, res, next) {
    console.log("req");
    console.log(req.body.params);
    var codeToUpdate = req.body.params.updates[0].value
    var token = req.body.params.updates[1].value
    var id = req.body.params.updates[2].value

    var decoded = jwt.decode(token);

    ShareableCode.findOneAndUpdate({user: id}, { code: JSON.parse(codeToUpdate) }, {upsert:true}, function(err, result){
        if (err) {
            return res.status(500).json({
                title: 'An error occurred0',
                error: err
            });
        }
        User.findOne({_id: id}, function(err, user) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred0',
                    error: err
                });
            }
            user.current_playlist = result;
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        title: 'couldnt save occurred',
                        error: err
                    });
                }
                res.status(201).json({
                    message: 'Saved code',
                    obj: result
                }); 
            });
        });
        res.status(201).json({
            message: 'Saved code',
            obj: result
        });
    });

});

router.post('/pushToCurrentSongs', function (req, res, next) {

    var song = req.body.params.updates[0].value
    var token = req.body.params.updates[1].value
    var id = req.body.params.updates[2].value

    var decoded = jwt.decode(token);

    Code.findOne({user: id}, function(err, code) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred0',
                error: err
            });
        }
        var song = new Song({
            name: song.name,
            id: song.id,
            votes: 0,
            code: code
        });
        code.songs_vote.push(song);
        code.save();
        res.status(201).json({
            message: 'Saved code',
            obj: result
        });

    });
});

router.post('/clearCurrentSongs', function (req, res, next) {

    var token = req.body.params.updates[0].value
    var id = req.body.params.updates[0].value

    var decoded = jwt.decode(token);

    Code.update({user: id}, { $set: { songs_vote: [] }}, function(err, affected){
        console.log('affected: ', affected);
    });

});

  module.exports = router;