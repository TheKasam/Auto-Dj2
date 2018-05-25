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

    User.findOne({_id: id}, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred0',
                error: err
            });
        }
        else if (!user) {
  
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'user not found'}
            });
        }
        else if (user._id != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        } else {
            console.log("bef pla");
            var playlistToSave = new Playlist({
                name: JSON.parse(playlist).name,
                id: JSON.parse(playlist).id,
                user: user
            });
            console.log(JSON.parse(playlist).name);
            playlistToSave.save(function(err, result) {
                if (err) {
                  console.log("could not save");
                  return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                  });  
                }
                else {
                    console.log("TO SAVE USER");
                    user.current_playlist = result;
                    user.save(function (err, result) {
                        if (err) {
                            console.log("user not saved");
                            return res.status(500).json({
                                title: 'An error occurred',
                                error: err
                            });
                        } else {
                            console.log("saved user");
                        }
                    });
                  console.log("saved playlists maybe");
                }
              });
              
            console.log(user);
            res.status(201).json({
                message: 'Saved playlist',
                obj: user
            });
        }

        console.log("found");
        
    });

});

router.post('/setShareableCode', function (req, res, next) {
    console.log("req");
    console.log(req.body.params);
    var code = req.body.params.updates[0].value
    var token = req.body.params.updates[1].value
    var id = req.body.params.updates[2].value

    var decoded = jwt.decode(token);

    ShareableCode.findOne({user: id}, function(err, codeResult) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred0',
                error: err
            });
        }
        else if (id != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        }
        else if (!codeResult) {
            //create code
            var codeToSave = new ShareableCode({
                code: JSON.parse(code),
                user: id
            });

            codeToSave.save(function(err, result) {
                if (err) {
                  return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                  });  
                }
                //no error
                User.findOne({_id: id}, function(err, user) {

                    if (err) {
                        return res.status(500).json({
                            title: 'An error occurred0',
                            error: err
                        });
                    }
                    else if (!user) {
                        return res.status(500).json({
                            title: 'An error occurred0',
                            error: "user desnt exist"
                        });
                    }
                    // user exists
                    user.shareable_code = result;
                    user.save(function (err, userResult) {
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
                        console.log("saved code to use");
                        
                    });
                    console.log("saved code");
                });
            });
        }

        else {
             //code exists for user
            // console.log("bef pla");
            // console.log(JSON.parse(code));
            // console.log(user);

            // console.log("after");
            
            
            // console.log(user);

            codeResult.code = JSON.parse(code);
            codeToSave.save(function(err, result) {
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
            
        }

        console.log("found");
        
    });

});

router.post('/pushToCurrentSongs', function (req, res, next) {
    console.log("req");
    console.log(req.body.params);
    var song = req.body.params.updates[0].value
    var token = req.body.params.updates[1].value
    var id = req.body.params.updates[2].value

    var decoded = jwt.decode(token);

    Code.findOne({_id: id}, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred0',
                error: err
            });
        }
        else if (!user) {
  
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'user not found'}
            });
        }
        else if (user._id != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        } else {
            console.log("bef pla");
            console.log(JSON.parse(code));
            console.log(user);
            var codeToSave = new ShareableCode({
                code: JSON.parse(code),
                user: user
            });
            console.log("after");
            codeToSave.save(function(err, result) {
                if (err) {
                  return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                  });  
                }
                else {
                    user.shareable_code = result;
                    user.save(function (err, result) {
                        if (err) {
                            return res.status(500).json({
                                title: 'An error occurred',
                                error: err
                            });
                        } else {
                            console.log("saved code to use");
                        }
                    });
                  console.log("saved code");
                }
              });
            
            console.log(user);
            res.status(201).json({
                message: 'Saved code',
                obj: user
            });
        }

        console.log("found");
        
    });

});



  module.exports = router;