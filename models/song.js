var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
    name: {type: String, required: true},
    id:{type: String, required: true},
    votes:{type: Integer, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});


module.exports = mongoose.model('Song', schema);