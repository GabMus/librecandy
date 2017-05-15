var express = require('express');
var router = express.Router(); // new instance of express router
var models = require('./models/librecandyModels.js');
var auth = require('./auth.js');
var jwt = require('jsonwebtoken');
var config = require('./config.js');
var multer = require('multer');
var imagic = require('imagemagick');
var fs = require('fs');
var mkdirp = require('fs-mkdirp');
imagic.convert.path = '/usr/bin/convert';

var multer_upload = multer({dest: config.media_upload});

const API_SUCCESS_MSG = {message: 'success', error: null};

function make_user_safe(user) {
    return {
        username: user.username,
        realname: user.realname,
        avatar: user.avatar, //TODO: implement avatar first
        email: user.email,
        bio: user.bio,
        signup_datetime: user.signup_datetime
    }
}

function make_treat_base_path(username, treat, detail) {
    return config.media_path +
        '/users/'+username +
        '/'+treat._id+
        '/'+detail._id+
        '/'+detail.version;
}
function make_treat_file_path(username, treat, detail, extension) {
    return make_treat_base_path(username, treat, detail)+
        '/'+treat.name+'_'+detail.version+extension;
}
function make_treat_screenshot_path(username, treat, detail) {
    return make_treat_base_path(username, treat, detail)+
        '/screenshots';
}

function treat2pkgname(treat) {
    var pkgname = 'org.' +
        treat.author + '.' +
        treat.name.replace(/ /g,'_');
    return pkgname;
}
function pkgname2treat(pkgname) {
    var parts = pkgname.split('.');
    var username = parts[1];
    var themename = parts[2];
    var to_ret = {err: null, treat: null};
    models.Treat.findOne({'author': username, 'name': themename},
        function(err, treat) {
            if (err) {to_ret.err = err; return to_ret;}
            to_ret.treat=treat;
            return to_ret;
        }
    );
}

router.use(function(req, res, next) { // refresh token every hour
    var token = req.headers['authorization'];
    if (token && token.substr(0,3)=='JWT') {
        token = token.substr(4);
        var decoded = jwt.verify(token, config.secret);
        // if 1 hour passed since token issue
        if (Date.now() - decoded.issue_time >= config.jwt_refresh_time) {
            var n_token = auth.generate_jwt_token(decoded.username);
            res.librecandy = {};
            // check in the frontend and get this new token
            res.librecandy.newtoken = n_token;
        }
    }
    next();
});

router.get('/', function(req, res){
    res.json({
        message: 'Welcome to the LibreCandy API v1! RTFM and make a proper request :)'
    });
});

router.route('/authenticate').post(auth.isAuthenticatedBasic, function(req,res) {
    var token = auth.generate_jwt_token(req.user.username);
    res.json({
        success: true,
        message: 'Token created for user ' + req.user.username,
        token: token
    });
});

router.route('/superuser').post(function(req, res) {
    if (true) return res.status(403).send('Forbidden'); // NOTE: DISABLE IN PRODUCTION!
    var user = new models.User();
    user.username = req.body.username;
    if (req.body.username.includes('.'))
        return res.json({
            success: false,
            error: 'Usernames cannot contain the `.` (dot) character'
        });
    user.email = req.body.email;
    user.password = req.body.password;
    user.is_superuser = true;
    if (req.body.realname) user.realname = req.body.realname;
    //if (req.body.avatar) user.avatar = req.body.avatar; // TODO: implement avatar loading
    if (req.body.password) user.password = req.body.password;
    if (req.body.bio) user.bio = req.body.bio;

    user.save(function(err) {
        if (err) return res.json(err);

        res.json(API_SUCCESS_MSG);
    });
});

router.route('/users').post(function(req, res) {
    var user = new models.User();
    user.username = req.body.username;
    if (req.body.username.includes('.'))
        return res.json({
            success: false,
            error: 'Usernames cannot contain the `.` (dot) character'
        });
    user.email = req.body.email;
    user.password = req.body.password;
    if (req.body.realname) user.realname = req.body.realname;
    //if (req.body.avatar) user.avatar = req.body.avatar; // TODO: implement avatar loading
    if (req.body.password) user.password = req.body.password;
    if (req.body.bio) user.bio = req.body.bio;

    user.save(function(err) {
        if (err) return res.json(err);

        res.json(API_SUCCESS_MSG);
    });
}).get(auth.isAuthenticated, function(req, res) {
    // can only use this function as superuser
    if (!req.user.is_superuser)
        return res.status(403).send('Forbidden');
    models.User.find(function(err, users) {
        if (err) return res.json(err);
        var offset=0;
        var limit=20;
        if (req.param('offset')) {
            offset=req.param('offset');
        }
        if (req.param('limit')) {
            limit=req.param('limit');
        }
        var safeusers = [];
        for (i in users) {
            safeusers.push(make_user_safe(users[i+offset]));
            if (i>=limit) {
                break;
            }
        }
        res.json({users: safeusers, offset: offset, limit: limit});
    });
});

router.route('/users/:username').get(function(req, res){
    models.User.findOne({'username': req.params.username}, function(err, user) {
        if (err) return res.json(err);

        res.json(make_user_safe(user));
    });
}).put(auth.isAuthenticated, function(req, res) {
    // if the user making the request isn't the requested user
    if ((req.params.username != req.user.username)) {
        // OR if the user isn't a superuser
        if (!req.user.is_superuser)
            return res.status(403).send('Forbidden');
    }
    models.User.findOne({'username': req.params.username}, function(err, user) {
        if (err) return res.json(err);

        if (req.body.realname) {
            user.realname = req.body.realname;
        }
        // if avatar
        if (req.body.bio) {
            user.bio = req.body.bio;
        }
        if (req.body.password) {
            user.password = req.body.password;
        }
        user.save(function(err) {
            if (err) return res.json(err);
            res.json(API_SUCCESS_MSG);
        });
    });
}).delete(auth.isAuthenticated, function(req, res) {
    if ((req.params.username != req.user.username)) {
        // OR if the user isn't a superuser
        if (!req.user.is_superuser)
            return res.status(403).send('Forbidden');
    }
    models.User.remove(
        {username: req.params.username},
        function(err, user) {
            if (err) return res.json(err);
            res.json(API_SUCCESS_MSG);
        }
    );
});

// TODO: complete using https://www.npmjs.com/package/multer
router.route('/users/:username/avatar').post(auth.isAuthenticated,
    multer_upload.single('avatar'), function(req, res) {
        // if the user making the request isn't the requested user
        if (req.params.username != req.user.username) {
            // OR if the user isn't a superuser
            if (!req.user.is_superuser) return res.status(403).send('Forbidden');
        }
        models.User.findOne({'username': req.params.username}, function(err, user) {
            if (err) return res.json(err);

            if (req.file.mimetype.substr(0,6)!='image/')
                return res.status(422).json({
                    success: false,
                    error: 'File is not an image (' + req.file.mimetype + ')'
                });
            var user_avatar_dir = config.media_path + 'users/' + user.username;
            var rel_user_avatar_dir = './media/users/' + user.username;
            mkdirp(rel_user_avatar_dir, function(err, results) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        error: err
                    });
                }
                var user_avatar_path = user_avatar_dir + '/avatar.png';
                imagic.convert([
                    req.file.path, // original image
                    '-resize', // option
                    config.avatart_size + 'x' + config.avatart_size, // size
                    user_avatar_path  // convert & move
                ], function (err, stdout) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            success: false,
                            error: err
                        });
                    }
                    console.log('avatar: imagemagick:' + stdout);
                    user.avatar = user_avatar_path;
                    // remove file in /tmp
                    fs.unlink(req.file.path, function(err) {
                        if (err) console.log(err);
                    });

                    user.save(function(err) {
                        if (err) return res.json(err);
                        return res.json(API_SUCCESS_MSG);
                    });
                });
            });
        });
}).delete(auth.isAuthenticated, function(req, res) {
    // if the user making the request isn't the requested user
    if (req.params.username != req.user.username) {
        // OR if the user isn't a superuser
        if (!req.user.is_superuser) return res.status(403).send('Forbidden');
    }

    models.User.findOne({'username': req.params.username}, function(err, user) {
        if (err) return res.json(err);
        fs.unlink(user.avatar, function(err) {
            if (err) return res.status(500).json(err);
            user.avatar=null;
            return res.json(API_SUCCESS_MSG);
        });
    });
});

router.route('/users/:username/treats').get(function(req, res) {
    models.Treat.find({'author': req.params.username}, function(err, treats) {
        if (err) return res.json(err);
        var offset=0;
        var limit=20;
        if (req.param('offset')) {
            offset=req.param('offset');
        }
        if (req.param('limit')) {
            limit=req.param('limit');
        }
        treats = treats.slice(offset, offset+limit);
        res.json({author: req.params.username, treats: treats, offset: offset, limit: limit});
    });
});

router.route('/treats').get(function(req, res) {
    models.Treat.find(function(err, treats) {
        if (err) return res.json(err);
        var offset=0;
        var limit=20;
        if (req.param('offset')) {
            offset=req.param('offset');
        }
        if (req.param('limit')) {
            limit=req.param('limit');
        }
        treats = treats.slice(offset, offset+limit);
        res.json({treats: treats, offset: offset, limit: limit});
    });
}).post(auth.isAuthenticated, function(req, res) {
    var treat = new models.Treat();
    if (req.body.name.includes('_') || req.body.name.includes('.'))
        return res.json({
            success: false,
            error: 'Treat names cannot contain the `_` (underscore) or `.` (dot) characters'
        });
    treat.name = req.body.name;
    treat.author = req.user.username;
    treat.category = req.body.category;
    treat.package_name = treat2pkgname(treat);
    treat.save(function(err) {
        if (err) return res.json(err);

        res.json({message: 'success', error: null, treat: treat});
    });
});

router.route('/treats/id/:treatid').get(function(req, res) {
    models.Treat.findOne({'_id': req.params.treatid}, function(err, treat) {
        if (err) return res.json(err);
        res.json(treat);
    });
}).delete(auth.isAuthenticated, function(req, res) {
    if ((req.params.username != req.user.username)) {
        if (!req.user.is_superuser)
            return res.status(403).send('Forbidden');
    }
    models.Treat.remove({'_id': req.params.treatid}, function(err, treat) {
        if (err) return res.json(err);
        res.json(API_SUCCESS_MSG);
    });
});

router.route('/treats/:pkgname').get(function(req, res) {
    models.Treat.findOne({'package_name': req.params.pkgname},
        function(err, treat) {
            if (err) return res.json(err);
            res.json(treat);
        }
    );
}).delete(auth.isAuthenticated, function(req, res) {
    if ((req.params.username != req.user.username)) {
        if (!req.user.is_superuser)
            return res.status(403).send('Forbidden');
    }
    models.Treat.remove({'package_name': req.params.pkgname},
        function(err, treat) {
            if (err) return res.json(err);
            res.json(API_SUCCESS_MSG);
        }
    );
});

router.route

module.exports = router;
