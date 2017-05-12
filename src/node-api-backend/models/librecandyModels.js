const MEDIA_PATH = '../uploads/mediafiles/';

const TREATS_FILE_REL_PATH = 'treats';
const TREATS_SCROT_REL_PATH = 'screenshots';
const USERS_AVATAR_REL_PATH = 'avatars';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

var mongoose = require('mongoose');
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
var make_upload_to_model = filePluginLib.make_upload_to_model;
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    realname: {type: String, trim: true},
    username: {type: String, trim: true, required: true, unique: true},
    // avatar using mongoose-file?
    email: {type: String trim: true, required: true, unique: true, match: EMAIL_REGEX},
    // password using passport?
    bio: {type: String, trim: true},
    signup_datetime: {type: Date, default: Date.now}
});

var TreatDetailSchema = new Schema({
    description: {type: String, trim: true, required: true},
    version: {type: String, trim: true, required: true},
    is_deprecated: {type: Boolean, default: false}
    // file field below
    //
});

// add file field
TreatDetailSchema.plugin(filePlugin, {
    name: 'file',
    upload_to: make_upload_to_model(MEDIA_PATH, TREATS_FILE_REL_PATH),
    relative_to: MEDIA_PATH
});

var TreatRatingSchema = new Schema({
    author: {type: User, required: true},
    pub_datetime: {type: Date, default: Date.now},
    value: {type: Number, min: 1, max: 10}
});

var TreatCommentSchema = new Schema({
    // _id should be already defined
    author: {type: User, required: true},
    pub_datetime: {type: Date, default: Date.now},
    content: {type: String, trim: true, required: true},
});

var TreatSchema = new Schema({
    // _id should be already defined
    name: {type: String, trim: true},
    category: {type: String, trim: true},
    author: {type: User, required: true},
    first_pub_datetime: {type: Date, default: Date.now},
    details: [TreatDetail],
    ratings: [TreatRating],
    comments: [TreatComment]
});

var models = {
    User: mongoose.model('User', UserSchema),
    Treat: mongoose.model('Treat', TreatSchema)
};

module.exports = models;
