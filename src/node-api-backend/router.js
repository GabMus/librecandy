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
var mv = require('mv');
var fse = require('fs-extra');
var imagesize = require('image-size');
imagic.convert.path = '/usr/bin/convert';

var multer_upload = multer({dest: config.media_upload});

const API_SUCCESS_MSG = {success: true, error: null};

function make_user_safe(user) {
    return {
        username: user.username,
        realname: user.realname,
        avatar: user.avatar,
        email: user.email,
        bio: user.bio,
        signup_datetime: user.signup_datetime
    }
}

function make_treat_base_path(username, treat, detail) {
    return config.media_path +
        '/users/'+username +
        '/'+treat.package_name+
        '/'+detail.version;
}
function get_file_ext(filename) {
    var parts = filename.split('.');
    if (parts[parts.length-2]=='tar') {
        return '.tar.' + parts[parts.length-1];
    }
    return '.' + parts[parts.length-1];
}
function make_treat_file_path(username, treat, detail, originalname) {
    return make_treat_base_path(username, treat, detail)+
        '/'+treat.name+'_'+detail.version+get_file_ext(originalname);
}
function make_treat_screenshot_path(username, treat, detail) {
    return make_treat_base_path(username, treat, detail)+
        '/screenshots/';
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

// callback(user, success)
function verify_user_action_authorized(user, requested_username, callback) { // NOTE: avoid using this for now
    if (user.username != requested_username) { // user requesting action on other user
        if (!user.is_superuser) { // user is not superuser
            return callback(null, false);
        }
    }
    return callback(user, true);
}
// callback(err, treat)
function verify_treat_action_authorized(user, treat_pkgname, callback) {
    models.Treat.findOne({'package_name': treat_pkgname}, function(err, treat) {
        if (err) return callback(err, null);
        if (!treat) return callback(404, null);
        if (user.username != treat.author) {
            if (!user.is_superuser) {
                return callback(403, null);
            }
        }
        return callback(null, treat);
    });
}

// callback(err)
function resize_mv(filepath, n_dirpath, n_filename, width, callback) { // no height to match original aspect ratio
    height = (typeof height !== 'undefined') ?  height : '';
    fse.mkdirs(n_dirpath, function(err) {
        if (err) return callback(err);
        imagic.convert([
            filepath,
            '-resize',
            width + 'x',
            n_filename
        ], function(err, stdout) {
            if (err) return callback(err);
            callback(null);
        });
    });
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
    if (true) return res.sendStatus(403); // NOTE: DISABLE IN PRODUCTION!
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
    if (req.body.password) user.password = req.body.password;
    if (req.body.bio) user.bio = req.body.bio;

    user.save(function(err) {
        if (err) return res.json(err);

        res.json(API_SUCCESS_MSG);
    });
}).get(auth.isAuthenticated, function(req, res) {
    // can only use this function as superuser
    if (!req.user.is_superuser)
        return res.sendStatus(403);
    models.User.find(function(err, users) {
        if (err) return res.json(err);
        var offset=0;
        var limit=20;
        if (req.param('offset')) {
            offset=parseInt(req.param('offset'));
        }
        if (req.param('limit')) {
            limit=parseInt(req.param('limit'));
        }
        var safeusers = [];
        for (i in users) {
            i=parseInt(i);
            if(!users[i+offset]) break;
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
        if (!user) return res.sendStatus(404);
        res.json(make_user_safe(user));
    });
}).put(auth.isAuthenticated, function(req, res) {
    // if the user making the request isn't the requested user
    if ((req.params.username != req.user.username)) {
        // OR if the user isn't a superuser
        if (!req.user.is_superuser)
            return res.sendStatus(403);
    }
    models.User.findOne({'username': req.params.username}, function(err, user) {
        if (err) return res.json(err);
        if (!user) return res.sendStatus(404);

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
            return res.sendStatus(403);
    }
    models.User.remove(
        {username: req.params.username},
        function(err, user) {
            if (err) return res.json(err);
            res.json(API_SUCCESS_MSG);
        }
    );
});
router.route('/users/:username/avatar').post(auth.isAuthenticated,
    multer_upload.single('avatar'), function(req, res) {
        // if the user making the request isn't the requested user
        if (req.params.username != req.user.username) {
            // OR if the user isn't a superuser
            if (!req.user.is_superuser) return res.sendStatus(403);
        }
        if (!req.file) return res.json({
            success: false,
            error: 'You must pass a valid image file as multipart/form-data'
        });
        if (req.file.mimetype.substr(0,6)!='image/')
        return res.status(422).json({
            success: false,
            error: 'File is not an image (' + req.file.mimetype + ')'
        });
        models.User.findOne({'username': req.params.username}, function(err, user) {
            if (err) return res.json(err);
            if (!user) return res.sendStatus(404);
            var user_avatar_dir = config.media_path + 'users/' + user.username;
            fse.mkdirs(user_avatar_dir, function(err, results) {
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
        if (!req.user.is_superuser) return res.sendStatus(403);
    }

    models.User.findOne({'username': req.params.username}, function(err, user) {
        if (err) return res.json(err);
        if (!user) return res.sendStatus(404);
        if (!user.avatar) return res.sendStatus(404);
        fs.unlink(user.avatar, function(err) {
            if (err) return res.status(500).json(err);
            user.avatar=null;
            user.save(function(err) {
                if (err) return res.json(err);
                return res.json(API_SUCCESS_MSG);
            });
        });
    });
});

router.route('/users/:username/treats').get(function(req, res) {
    models.Treat.find({'author': req.params.username}, function(err, treats) {
        if (err) return res.json(err);
        if (!treats) return res.sendStatus(404);
        var offset=0;
        var limit=20;
        if (req.param('offset')) {
            offset=parseInt(req.param('offset'));
        }
        if (req.param('limit')) {
            limit=parseInt(req.param('limit'));
        }
        var treats_filter = treats.slice(offset, offset+limit);
        res.json({author: req.params.username, treats: treats_filter, offset: offset, limit: limit});
    });
});

router.route('/treats').get(function(req, res) {
    models.Treat.find({}, null, {sort: '-first_pub_datetime'}, function(err, treats) {
        if (err) return res.json(err);
        var offset=0;
        var limit=20;
        if (req.param('offset')) {
            offset=parseInt(req.param('offset'));
        }
        if (req.param('limit')) {
            limit=parseInt(req.param('limit'));
        }
        var treats_filter = treats.slice(offset, offset+limit);
        res.json({treats: treats_filter, offset: offset, limit: limit});
    });
}).post(auth.isAuthenticated, function(req, res) {
    var treat = new models.Treat();
    if (req.body.name.includes('_') || req.body.name.includes('.'))
        return res.json({
            success: false,
            error: 'Treat names cannot contain the `_` (underscore) or `.` (dot) characters'
        });
    if (!config.treat_categories.includes(req.body.category))
        return res.json({
            success: false,
            error: 'Invalid treat category'
        });
    treat.name = req.body.name;
    treat.author = req.user.username;
    treat.category = req.body.category;
    treat.description = req.body.description;
    treat.package_name = treat2pkgname(treat);
    treat.save(function(err) {
        if (err) return res.json(err);

        res.json({success: true, error: null, treat: treat});
    });
});

router.route('/treats/categories').get(function(req, res) {
    res.json({categories: config.treat_categories});
});

router.route('/treats/categories/:category').get(function(req, res) {
    if (!config.treat_categories.includes(req.params.category))
        return res.json({
            success: false,
            error: 'Invalid treat category'
        });
    models.Treat.find({'category': req.params.category}, null, {sort: '-first_pub_datetime'}, function(err, treats) {
        if (!treats) return res.sendStatus(404);
        if (err) return res.json(err);
        var offset=0;
        var limit=20;
        if (req.param('offset')) {
            offset=parseInt(req.param('offset'));
        }
        if (req.param('limit')) {
            limit=parseInt(req.param('limit'));
        }
        var treats_filter = treats.slice(offset, offset+limit);
        res.json({treats: treats_filter, offset: offset, limit: limit});
    });
});

router.route('/treats/categories/:category/orderby/rating').get(function(req, res) {
    if (!config.treat_categories.includes(req.params.category))
        return res.json({
            success: false,
            error: 'Invalid treat category'
        });
    models.Treat.find({'category': req.params.category}).sort({'total_rating': -1, 'first_pub_datetime': -1}).exec(function(err, treats) {
        if (!treats) return res.sendStatus(404);
        if (err) return res.json(err);
        var offset=0;
        var limit=20;
        if (req.param('offset')) {
            offset=parseInt(req.param('offset'));
        }
        if (req.param('limit')) {
            limit=parseInt(req.param('limit'));
        }
        var treats_filter = treats.slice(offset, offset+limit);
        res.json({treats: treats_filter, offset: offset, limit: limit});
    });
});

router.route('/treats/orderby/rating').get(function(req, res) {
    models.Treat.find().sort({'total_rating': -1, 'first_pub_datetime': -1}).exec(function(err, treats) {
        if (!treats) return res.sendStatus(404);
        if (err) return res.json(err);
        var offset=0;
        var limit=20;
        if (req.param('offset')) {
            offset=parseInt(req.param('offset'));
        }
        if (req.param('limit')) {
            limit=parseInt(req.param('limit'));
        }
        var treats_filter = treats.slice(offset, offset+limit);
        res.json({treats: treats_filter, offset: offset, limit: limit});
    });
});

router.route('/treats/:pkgname').get(function(req, res) {
    models.Treat.findOne({'package_name': req.params.pkgname},
        function(err, treat) {
            if (err) return res.json(err);
            if (!treat) return res.sendStatus(404);
            res.json(treat);
        }
    );
}).delete(auth.isAuthenticated, function(req, res) {
    // verify that the treat belongs to the authenticated user
    models.Treat.findOne({'package_name': req.params.pkgname}, function(err, treat) {
        if (err) return res.json(err);

        if (!treat) return res.sendStatus(404);

        if (req.user.username != treat.author) {
            if (!req.user.is_superuser) {
                return res.sendStatus(403);
            }
        }
        for (i in treat.details) {
            if (!treat.details[i] || !treat.details[i].file) break;
            fs.unlink(treat.details[i].file, function(err) {
                if (err) return res.status(500).json(err);
                treat.details.splice(i, 1);
            });
        }
        models.Treat.remove({'package_name': req.params.pkgname},
            function(err, treat) {
                if (err) return res.json(err);
                res.json(API_SUCCESS_MSG);
            }
        );
    });
}).put(auth.isAuthenticated, function(req, res) {
    // verify that the treat belongs to the authenticated user
    models.Treat.findOne({'package_name': req.params.pkgname}, function(err, treat) {
        if (err) return res.json(err);
        if (!treat) return res.sendStatus(404);
        if (req.user.username != treat.author) {
            if (!req.user.is_superuser) {
                return res.sendStatus(403);
            }
        }
        if (req.body.description) treat.description = req.body.description;
        treat.save(function(err) {
            if (err) return res.json(err);
            res.json({success: true, error: null, treat: treat});
        });
    });
});

router.route('/treats/:pkgname/versions') // aka detail
    .post(auth.isAuthenticated, function(req,res) {
        models.Treat.findOne(
            {'package_name': req.params.pkgname},
            function(err, treat) {
                if (err) return res.json(err);
                if (!treat) return res.sendStatus(404);
                if (req.user.username != treat.author)
                    if (!req.user.is_superuser)
                        return res.sendStatus(403);

                var detail = new models.TreatDetail();
                if (!req.body.version) return res.json({success: false, error: 'Version not provided'});
                if (req.body.version.includes(' ')) {
                    return res.json({success: false, error: 'Version names cannot contain spaces'});
                }
                detail.version = req.body.version;
                for (i in treat.details) {
                    if (treat.details[i].version == detail.version) {
                        return res.json({success: false, error: 'Duplicate version name'});
                    }
                }
                treat.details.unshift(detail); // unshift = head insert
                treat.save(function(err) {
                    if (err) return res.json(err);
                    res.json({success: true, error: null, treat: treat});
                });
            }
        );
    }
);

router.route('/treats/:pkgname/versions/:version')
    .put(auth.isAuthenticated, function(req, res) { //TODO: is_deprecated value doesn't get updated, remains false in every occasion
        models.Treat.findOne(
            {'package_name': req.params.pkgname},
            function(err, treat) {
                if (err) return res.json(err);
                if (!treat) return res.sendStatus(404);
                if (req.user.username != treat.author) {
                    if (!req.user.is_superuser) {
                        return res.sendStatus(403);
                    }
                }
                var detail = null;
                var index = null;
                for (i in treat.details) {
                    if (treat.details[i].version == req.params.version) {
                        detail = treat.details[i];
                        index = i;
                        break;
                    }
                }
                if (!detail) return res.sendStatus(404);
                if (!req.body.is_deprecated) return res.json({
                    success: false,
                    error: 'is_deprecated body value not passed'
                });
                if (req.body.is_deprecated == 'true') {
                    detail.is_deprecated = true;
                }
                else if (req.body.is_deprecated == 'false') {
                    detail.is_deprecated = false;
                }
                else {
                    return res.json({
                        success: false,
                        error: 'is_deprecated must be either \'true\' or \'false\''
                    });
                }
                treat.save(function(err) {
                    if (err) return res.json(err);
                    return res.json({success: true, error: null, treat: treat});
                });
            }
        );
    }
)
    .delete(auth.isAuthenticated, function(req, res) {
        models.Treat.findOne(
            {'package_name': req.params.pkgname},
            function(err, treat) {
                if (err) return res.json(err);
                if (!treat) return res.sendStatus(404);
                if (req.user.username != treat.author) {
                    if (!req.user.is_superuser) {
                        return res.sendStatus(403);
                    }
                }
                var detail = null;
                for (i in treat.details) {
                    if (treat.details[i].version == req.params.version) {
                        fs.unlinkSync(treat.details[i].file);
                        if (err) return res.status(500).json(err);
                        treat.details.splice(i, 1);
                    }
                }

                treat.save(function(err) {
                    if (err) return res.json(err);
                    return res.json({success: true, error: null, treat: treat});
                });
            }
        );
    }
);

router.route('/treats/:pkgname/versions/:version/file').post(auth.isAuthenticated,
    multer_upload.single('versionfile'), function(req, res) {
        // if the user making the request isn't the requested user
        models.Treat.findOne(
            {'package_name': req.params.pkgname},
            function(err, treat) {
                if (err) return res.json(err);
                if (!treat) return res.sendStatus(404);
                if (!req.file) return res.json({
                    success: false,
                    error: 'You must pass a valid archive (.tar.gz, .zip, ...) file as multipart/form-data',
                    treat: treat
                });
                if (!config.treat_mimetypes.includes(req.file.mimetype)) {
                    fs.unlinkSync(req.file.path);
                    return res.status(422).json({success: false, error: 'The loaded file is not a supported archive', treat: treat});
                }
                if (req.user.username != treat.author) {
                    if (!req.user.is_superuser) {
                        return res.sendStatus(403);
                    }
                }
                var detail = null;
                for (i in treat.details) {
                    if (treat.details[i].version == req.params.version) {
                        detail = treat.details[i];
                        break;
                    }
                }
                if (!detail) return res.sendStatus(404);
                var treat_file_path = make_treat_file_path(
                    req.user.username,
                    treat,
                    detail,
                    req.file.originalname
                );
                if (fs.existsSync(treat_file_path)) return res.json({
                    success: false,
                    error: 'File already exists for this version. If you want to update, create a new version or delete this one and re-create it',
                    treat: treat
                });
                var treat_file_dir = make_treat_base_path(
                    req.user.username,
                    treat,
                    detail
                );
                mv(req.file.path, treat_file_path, {mkdirp: true},
                    function(err, results) {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                success: false,
                                error: err
                            });
                        }
                        detail.file = treat_file_path;
                        treat.save(function(err) {
                            if (err) return res.json(err);
                            return res.json({success: true, error: null, treat: treat});
                        });
                    }
                );
            }
        );
    }
);



router.route('/treats/:pkgname/screenshots').post(auth.isAuthenticated,
    multer_upload.single('screenshot'), function(req, res) {
        // if the user making the request isn't the requested user
        if (!req.file) return res.json({
            success: false,
            error: 'You must pass a valid image file as multipart/form-data'
        });
        if (req.file.mimetype.substr(0,6)!='image/')
            return res.status(422).json({
                success: false,
                error: 'File is not an image (' + req.file.mimetype + ')'
            });
        models.Treat.findOne(
            {'package_name': req.params.pkgname},
            function(err, treat) {
                if (err) return res.json(err);
                if (!treat) return res.sendStatus(404);
                if (req.user.username != treat.author) {
                    if (!req.user.is_superuser) {
                        return res.sendStatus(403);
                    }
                }
                var detail = null;
                for (i in treat.details) {
                    if (treat.details[i].version == req.params.version) {
                        detail = treat.details[i];
                        break;
                    }
                }
                if (!detail) {
                    return res.sendStatus(404);
                }

                var screenshot_dir_path = make_treat_screenshot_path(
                    req.user.username,
                    treat,
                    detail
                );
                var screenshot_filename = treat.name+'_screenshot'+
                    treat.screenshots.length+'_'+Date.now()+'.png';
                fse.mkdirs(screenshot_dir_path, function(err) {
                    console.log(err);
                    var screenshot_path = screenshot_dir_path+
                        '/'+screenshot_filename;
                        if (imagesize(req.file.path).width > 1920) {
                            imagic.convert([
                                req.file.path, // original image
                                '-resize', // option
                                config.screenshot_size + 'x', // size
                                screenshot_path  // convert & move
                            ], function (err, stdout) {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                }
                                var scrot_obj = new models.TreatScreenshot();
                                scrot_obj.file = screenshot_path;
                                scrot_obj.filename = screenshot_filename;
                                if (treat.screenshots.length == 0)
                                    scrot_obj.is_main = true;
                                treat.screenshots.push(scrot_obj);
                                // remove file in /tmp
                                fs.unlink(req.file.path, function(err) {
                                    if (err) console.log(err);
                                });
                                treat.save(function(err) {
                                    if (err) return res.json(err);
                                    return res.json({success: true, error: null, treat: treat});
                                });
                            });
                        }
                        else {
                            imagic.convert([
                                req.file.path, // original image
                                screenshot_path  // convert & move
                            ], function (err, stdout) {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({
                                        success: false,
                                        error: err
                                    });
                                }
                                var scrot_obj = new models.TreatScreenshot();
                                scrot_obj.file = screenshot_path;
                                scrot_obj.filename = screenshot_filename;
                                if (treat.screenshots.length == 0)
                                    scrot_obj.is_main = true;
                                treat.screenshots.push(scrot_obj);
                                // remove file in /tmp
                                fs.unlink(req.file.path, function(err) {
                                    if (err) console.log(err);
                                });
                                treat.save(function(err) {
                                    if (err) return res.json(err);
                                    return res.json({success: true, error: null, treat: treat});
                                });
                            });
                        }
                    }
                );
            }
        );
    }
);

router.route('/treats/:pkgname/screenshots/:scrotfilename').put(auth.isAuthenticated, function(req, res) {
    models.Treat.findOne(
        {'package_name': req.params.pkgname},
        function(err, treat) {
            if (err) return res.json(err);
            if (!treat) return res.sendStatus(404);
            if (req.user.username != treat.author) {
                if (!req.user.is_superuser) {
                    return res.sendStatus(403);
                }
            }
            var scrot = null;
            for (i in treat.screenshots) {
                if (treat.screenshots[i].filename == req.params.scrotfilename) {
                    scrot = treat.screenshots[i];
                }
            }
            if (!scrot) return res.sendStatus(404);
            for (i in treat.screenshots) {
                if (treat.screenshots[i]!=scrot) {
                    treat.screenshots[i].is_main = false;
                }
            }
            scrot.is_main = true;
            treat.save(function(err) {
                if (err) return res.json(err);
                return res.json({success: true, error: null, treat: treat});
            });
        }
    );
}).delete(auth.isAuthenticated, function(req, res) {
    models.Treat.findOne(
        {'package_name': req.params.pkgname},
        function(err, treat) {
            if (err) return res.json(err);
            if (!treat) return res.sendStatus(404);
            if (req.user.username != treat.author) {
                if (!req.user.is_superuser) {
                    return res.sendStatus(403);
                }
            }
            var scrot = null;
            for (i in treat.screenshots) {
                if (treat.screenshots[i].filename == req.params.scrotfilename) {
                    scrot = treat.screenshots[i];
                    fs.unlink(scrot.file);
                    treat.screenshots.splice(i, 1);
                    if (treat.screenshots.length != 0 && scrot.is_main) {
                        treat.screenshots[0].is_main = true;
                    }
                    break
                }
            }
            if (!scrot) {
                return res.sendStatus(404);
            }
            treat.save(function(err) {
                if (err) return res.json(err);
                return res.json({success: true, error: null, treat: treat});
            });
        }
    );
});

router.route('/treats/:pkgname/comments').post(auth.isAuthenticated, function(req, res) {
    models.Treat.findOne({'package_name': req.params.pkgname}, function(err, treat) {
        if (err) return res.json(err);
        var comment = new models.TreatComment();
        comment.author = req.user.username;
        if (!req.body.content) return res.json({
            success: false,
            error: 'Comment content not provided'
        });
        comment.content = req.body.content;
        treat.comments.unshift(comment);
        treat.save(function(err) {
            if (err) return res.json(err);
            return res.json({success: true, error: null, treat: treat});
        });
    });
});

router.route('/treats/:pkgname/comments/:commentid').put(auth.isAuthenticated, function(req,res) {
    models.Treat.findOne({'package_name': req.params.pkgname}, function(err, treat) {
        if (err) return res.json(err);
        var comment = null;
        for (i in treat.comments) {
            if (treat.comments[i]._id == req.params.commentid) {
                comment = treat.comments[i];
                break;
            }
        }
        if (!comment) return res.sendStatus(404);
        if (comment.author != req.user.username) {
            if (!req.user.is_superuser) {
                return res.sendStatus(403);
            }
        }
        if (!req.body.content) return res.json({
            success: false,
            error: 'Comment content not provided'
        });
        comment.content = req.body.content;
        treat.save(function(err) {
            if (err) return res.json(err);
            return res.json({success: true, error: null, treat: treat});
        });
    });
}).delete(auth.isAuthenticated, function(req,res) {
    models.Treat.findOne({'package_name': req.params.pkgname}, function(err, treat) {
        if (err) return res.json(err);
        var comment = null;
        for (i in treat.comments) {
            if (treat.comments[i]._id == req.params.commentid) {
                comment = treat.comments[i];
                if (comment.author != req.user.username) {
                    if (!req.user.is_superuser) {
                        return res.sendStatus(403);
                    }
                }
                // delete comment
                treat.comments.splice(i,1);
                break;
            }
        }
        if (!comment) return res.sendStatus(404);
        treat.save(function(err) {
            if (err) return res.json(err);
            return res.json({success: true, error: null, treat: treat});
        });
    });
});

router.route('/treats/:pkgname/ratings').post(auth.isAuthenticated, function(req, res) {
    models.Treat.findOne({'package_name': req.params.pkgname}, function(err, treat) {
        if (err) return res.json(err);
        if (!treat) return res.sendStatus(404);
        var rating = new models.TreatRating();
        rating.author = req.user.username;
        if (!req.body.rating) return res.json({
            success: false,
            error: 'Rating value not provided'
        });
        rating.value = req.body.rating;
        treat.ratings.unshift(rating);
        var rating_rawtotal = 0;
        var rating_count = treat.ratings.length;
        for (i in treat.ratings) {
            rating_rawtotal = rating_rawtotal + treat.ratings[i].value;
        }
        treat.total_rating = Math.floor((rating_rawtotal/rating_count)+0.5);
        treat.save(function(err) {
            if (err) return res.json(err);
            return res.json({success: true, error: null, treat: treat});
        });
    });
});

router.route('/treats/:pkgname/ratings/:ratingid').put(auth.isAuthenticated, function(req,res) {
    models.Treat.findOne({'package_name': req.params.pkgname}, function(err, treat) {
        if (err) return res.json(err);
        if (!treat) return res.sendStatus(404);
        var rating = null;
        for (i in treat.ratings) {
            if (treat.ratings[i]._id == req.params.ratingid) {
                rating = treat.ratings[i];
                break;
            }
        }
        if (!rating) return res.sendStatus(404);
        if (rating.author != req.user.username) {
            if (!req.user.is_superuser) {
                return res.sendStatus(403);
            }
        }
        if (!req.body.rating) return res.json({
            success: false,
            error: 'Comment content not provided'
        });
        rating.value = req.body.rating;
        var rating_rawtotal = 0;
        var rating_count = treat.ratings.length;
        for (i in treat.ratings) {
            rating_rawtotal = rating_rawtotal + treat.ratings[i].value;
        }
        treat.total_rating = Math.floor((rating_rawtotal/rating_count)+0.5);
        treat.save(function(err) {
            if (err) return res.json(err);
            return res.json({success: true, error: null, treat: treat});
        });
    });
}).delete(auth.isAuthenticated, function(req,res) {
    models.Treat.findOne({'package_name': req.params.pkgname}, function(err, treat) {
        if (err) return res.json(err);
        if (!treat) return res.sendStatus(404);
        var rating = null;
        for (i in treat.ratings) {
            if (treat.ratings[i]._id == req.params.ratingid) {
                rating = treat.ratings[i];
                if (rating.author != req.user.username) {
                    if (!req.user.is_superuser) {
                        return res.sendStatus(403);
                    }
                }
                // delete rating
                treat.ratings.splice(i,1);
                var rating_rawtotal = 0;
                var rating_count = treat.ratings.length;
                for (i in treat.ratings) {
                    rating_rawtotal = rating_rawtotal + treat.ratings[i].value;
                }
                treat.total_rating = Math.floor((rating_rawtotal/rating_count)+0.5);
                treat.save(function(err) {
                    if (err) return res.json(err);
                    return res.json({success: true, error: null, treat: treat});
                });
            }
        }
        if (!rating) return res.sendStatus(404);
        return res.sendStatus(500);
    });
});

module.exports = router;
