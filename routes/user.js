var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');





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