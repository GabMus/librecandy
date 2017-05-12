var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TreatDetail = new Schema({
    description: String,
    version: String,
    is_deprecated: Boolean,
    //file: 
});

var Treat = new Schema({
    name: String,
    category: String,
    author: String,
    first_pub_datetime: {type: Date, default: Date.now},
    details:
});
