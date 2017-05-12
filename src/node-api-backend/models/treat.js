//dont use

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TreatSchema = new Schema({
    name: String,
    category: String,
    author: String,
    first_pub_datetime: {type: Date, default: Date.now},
    details:
});
