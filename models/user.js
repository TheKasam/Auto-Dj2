var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    firstName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    access_token: {type: String, required: false},
    playlists: [{type: Schema.Types.ObjectId, ref: 'Playlist'}]
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);