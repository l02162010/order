var express = require('express');
var router = express.Router();

router.use('/', function (req, res, next) {
    var error = req.flash('error');

    if (error) {
        req.app.locals.error = error;
    }

    next();
}, function (req, res, next) {
    res.error = function (message, redirect) {
        req.flash('error', {
            message: message
        });

        res.redirect(redirect);
    };

    next();
});

router.get('/', function (req, res, next) {
    if (req.session.user) {
        req.app.locals.user = req.session.user;
    }
    else {
        req.app.locals.user = 'undefined';
    }


    next();
}, function (req, res, next) {
    models.CoverPhoto.find().exec().then(function (coverPhoto) {
        res.render('index', {
            title: '首頁',
            coverPhotos: coverPhoto || [],
            error: req.flash('error') || undefined
        });
    });
});

router.use('/order', require('./order'));
router.use('/query', require('./query'));
router.use('/admin', require('./admin'));
router.use('/user', require('./user'));

module.exports = router;
