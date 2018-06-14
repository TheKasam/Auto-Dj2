var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
    name: {type: String, required: true, default: ''},
    id:{type: String, required: true, default: ''},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});


module.exports = mongoose.model('Playlist', schema);