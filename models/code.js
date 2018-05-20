var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
    code: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    songs_vote: [{type: Schema.Types.ObjectId, ref: 'Song'}]
});

module.exports = mongoose.model('Code', schema);