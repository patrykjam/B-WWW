var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var commentsSchema = new Schema({
    product_id: {type: Number, required: true},
    comment: {type: String, required: true},
    author: {type: String, required: true}
});

var Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;
