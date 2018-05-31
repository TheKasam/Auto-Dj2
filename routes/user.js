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

router.get('/getSongVote', function(req, res) {
    //check if user exists

    var id = JSON.parse(req.query.updates[0]).value;
    console.log("loggin gid");
    console.log(id);

    ShareableCode.findOne({user: id}, function(err, code) {
      if (err) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
      }

      Song.find({code: code._id}, function(err, songs) {
    
        console.log(songs);
        res.status(200).json({
            message: 'Successfully retrieved votes',
            obj: songs
          });


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

    Playlist.findOneAndUpdate({user: id}, { name: JSON.parse(playlist).name, id:JSON.parse(playlist).id  }, { upsert:true, new: true}, function(err, result){
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        console.log("loggin result", result);
        User.findOne({_id: id}, function(err, user) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            console.log("loggin result2", result);
            user.current_playlist = result;
            console.log("loggin result3", result);
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

    ShareableCode.findOneAndUpdate({user: id}, { code: JSON.parse(codeToUpdate) }, {upsert:true, new: true}, function(err, result){
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
            user.shareable_code = result;
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

router.post('/pushToCurrentSongs', function (req, res) {

    var song = JSON.parse(req.body.params.updates[0].value)
    var token = req.body.params.updates[1].value
    var id = req.body.params.updates[2].value
    console.log("req");

    console.log( song.name);
    var decoded = jwt.decode(token);

    ShareableCode.findOne({user: id}, function(err, code) {
        console.log("code" ,code);
        if (err) {
            return res.status(500).json({
                title: 'An error occurred0',
                error: err
            });
        }
        var songToSave = new Song({
            name: song.name,
            id: song.id,
            votes: 0,
            code: code._id
        });

        songToSave.save(function (err, result) {
            console.log("logging song", result);

            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            code.songs_vote.push(result);
            code.save();
            res.status(201).json({
                message: 'Saved code',
                obj: result
            });
    
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

router.post('/updateVote', function (req, res, next){

    var songId = JSON.parse(req.body.params.updates[0].value);
    console.log("songId");
    console.log(req.body.params);
    var token = req.body.params.updates[1].value;

    var decoded = jwt.decode(token);

    Song.findOne({id: songId}, function(err, songToSave) {
        console.log("code" ,code);
        if (err) {
            return res.status(500).json({
                title: 'An error occurred0',
                error: err
            });
        }
        songToSave.votes = songToSave.votes + 1
        songToSave.save(function (err, result) {
            console.log("logging song", result);

            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
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

module.exports = router;