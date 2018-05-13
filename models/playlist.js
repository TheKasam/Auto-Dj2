var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
    playlist: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});


module.exports = mongoose.model('Playlist', schema);