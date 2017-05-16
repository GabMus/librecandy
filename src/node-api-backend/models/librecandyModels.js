const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    realname: {type: String, trim: true},
    username: {type: String, trim: true, required: true, unique: true},
    avatar: {type: String, trim: true},
    email: {type: String, trim: true, required: true, unique: true, match: EMAIL_REGEX},
    password: {type: String, required: true},
    bio: {type: String, trim: true},
    signup_datetime: {type: Date, default: Date.now},
    is_superuser: {type: Boolean, default: false}
});

// this function is called BEFORE the user.save() function is executed
// basically hashes the password if it's changed
UserSchema.pre('save', function (callback) {
    var user = this;

    //if password is unchanged, do nothing
    if (!user.isModified('password')) return callback();

    //if password is changed, hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err); //error checking
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

// add a method to User to verify passwords
UserSchema.methods.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

var TreatScreenshotSchema = new Schema({
    file: {type: String, trim: true}, // required?
    filename: {type: String, trim:true},
    is_main: {type: Boolean, default: false}
});

var TreatDetailSchema = new Schema({
    version: {type: String, trim: true, required: true},
    is_deprecated: {type: Boolean, default: false},
    file: {type: String, trim: true}, // required?
    pub_datetime: {type: Date, default: Date.now}
});

var TreatRatingSchema = new Schema({
    author: {type: String, required: true},
    pub_datetime: {type: Date, default: Date.now},
    value: {type: Number, min: 1, max: 10}
});

var TreatCommentSchema = new Schema({
    author: {type: String, required: true},
    pub_datetime: {type: Date, default: Date.now},
    content: {type: String, trim: true, required: true},
});

var TreatSchema = new Schema({
    // _id should be already defined
    name: {type: String, trim: true, required: true},
    description: {type: String, trim: true, required: true},
    category: {type: String, trim: true, required: true},
    author: {type: String, required: true}, // username
    package_name: {type: String, required: true, unique: true},
    first_pub_datetime: {type: Date, default: Date.now},
    screenshots: [TreatScreenshotSchema], // is this legal?
    details: [TreatDetailSchema],
    ratings: [TreatRatingSchema],
    comments: [TreatCommentSchema],
    total_rating: {type: Number, default: 0}
});

var models = {
    User: mongoose.model('User', UserSchema),
    Treat: mongoose.model('Treat', TreatSchema),
    TreatComment: mongoose.model('TreatComment', TreatCommentSchema),
    TreatRating: mongoose.model('TreatRating', TreatRatingSchema),
    TreatDetail: mongoose.model('TreatDetail', TreatDetailSchema),
    TreatScreenshot: mongoose.model('TreatScreenshot', TreatScreenshotSchema)
};

module.exports = models;
