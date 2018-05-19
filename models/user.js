var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    firstName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    pass_id: {type: String, required: true},
    access_token: {type: String, required: false},
    refresh_token: {type: String, required: false},
    shareable_code: {type: Schema.Types.ObjectId, ref: 'Code'},
    current_playlist: {type: Schema.Types.ObjectId, ref: 'Playlist'},
    songs_vote: [{type: Schema.Types.ObjectId, ref: 'Song'}]
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);