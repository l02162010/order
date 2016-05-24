/**
 * Created by mosluce on 2016/5/2.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var multer = require('multer');
var upload = multer({
    dest: path.join(__dirname, '..', '..', 'temp')
});

var photoDir = path.join(__dirname, '..', '..', 'public', 'photo');

if (!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir);
}

var routeRoot = '/admin/coverPhoto';

router.get('/', function (req, res, next) {
    models.CoverPhoto.find().exec().then(function (coverPhoto) {
        res.render('admin/coverPhoto', {
            title: 'Order::Admin::CoverPhoto',
            coverPhotos: coverPhoto || [],
            error: req.flash('error') || undefined
        });
    });
});

router.post('/', upload.single('photo'), function (req, res, next) {
    var file = req.file;
    var data = req.body;

    data.price = {
        small: data.priceSmall,
        big: data.priceBig
    };

    var pattern = /image\/.+/;

    if (!pattern.test(file.mimetype)) {
        return res.render('admin/coverPhoto', {
            title: 'Order::Admin::coverPhoto',
            error: {
                message: 'mimetype is not allow'
            }
        });
    }

    models.CoverPhoto.create(data).then(function (coverPhoto) {
        fs.rename(file.path, path.join(photoDir, coverPhoto.id), function (err) {
            if (err) return next(err);

            res.redirect(routeRoot);
        });
    });
});

//update
router.post('/:id', upload.single('photo'), function (req, res, next) {
    var id = req.params.id;

    var file = req.file;
    var data = req.body;


    var pattern = /image\/.+/;


    if (!pattern.test(file.mimetype)) {
        return res.render('admin/coverPhoto', {
            title: 'Order::Admin::coverPhoto',
            error: {
                message: 'mimetype is not allow'
            }
        });
    }

    models.CoverPhoto.findById(id).exec().then(function (coverPhoto) {
        if (!coverPhoto) {
            req.flash('error', {
                message: '找不到要更新的物件'
            });
            return res.redirect(routeRoot);
        }

        coverPhoto = _.extend(coverPhoto, data);
        return coverPhoto.save();
    }).then(function (coverPhoto) {
        console.log(file.path, photoDir, coverPhoto.id);

        fs.rename(file.path, path.join(photoDir, coverPhoto.id), function (err) {
            if (err) return next(err);

            res.redirect(routeRoot);
        });
    }).catch(next);
});

//delete
router.post('/delete/:id', function (req, res, next) {
    var id = req.params.id;

    models.CoverPhoto.findById(id).exec().then(function (coverPhoto) {
        return coverPhoto.remove();
    }).then(function () {
        res.redirect(routeRoot);
    }).catch(next);
});

module.exports = router;