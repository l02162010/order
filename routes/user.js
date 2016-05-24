var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
var rest = require('restler');

router.get('/login', function (req, res, next) {
    res.render('user/login', {
        title: 'Restaurant::Login'
    });
});

router.post('/login', function (req, res, next) {
    var data = req.body;
    var phone = data.phone;
    var password = data.password;

    models.Vip.findOne({
        phone: phone
    }).exec().then(function(user) {
        if(!user) {
            return res.render('user/login', {
                title: 'Restaurant::Login',
                error: {
                    message: 'VIP is not exists'
                }
            });
        }

        if(user.password !== password) {
            return res.render('user/login', {
                title: 'Restaurant::Login',
                error: {
                    message: 'Password is invalid'
                }
            });
        }

        req.session.user = user;
        res.cookie('token', jwt.sign({userId: user.id}, config.secret), {
            expires: new Date(Date.now() + 60*60*1000)
        });

        res.redirect('/');
    });
});

router.get('/register', function (req, res, next) {
    res.render('user/register', {
        title: 'Restaurant::Register'
    });
});

router.post('/register', function (req, res, next) {
    var data = req.body;
    var phone = data.phone;
    var password = data.password;
    var displayName = data.displayName;

    if (!phone || !password || !displayName) {
        return res.render('user/register', {
            title: 'Restaurant::Register',
            error: {
                message: 'All Fields must be filled'
            }
        });
    }

    models.Vip.findOne({
        phone: phone
    }).exec().then(function (user) {
        if (user) {
            return res.render('user/register', {
                title: 'Restaurant::Register',
                error: {
                    message: 'Phone is exists'
                }
            });
        }

        models.Vip.create({
            phone: phone,
            password: password,
            displayName: displayName
        }).then(function() {
            return res.redirect('/user/login');
        });
    })
});

router.post('/register/json', function (req, res, next) {
    var ssNum = req.body.account;

    rest.post('http://webservice1.ltu.edu.tw/ltu.asmx/getStuName', {
        data: {
            userName: ssNum
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        parser: rest.parsers.xml
    }).on('success', function (data) {

        console.log(data.string._);
        console.log('---');
        console.log(data.string);
        console.log('---');
        console.log(data);
        try {
            var result = data.string._;

            if (!result) {
                return res.send({success: false, message: '登入失敗'}); // try
            } else {
                return res.send({success: result});

            }

        } catch (ex) {
            console.log('exception', ex);
            return res.send({success: false, message: '發生錯誤'});
        }
    }).on('fail', function (error) {
        console.error(error);
        return res.send({success: false, message: '發生錯誤'}); //OK 了 你前端怎麼呼叫?
        //已經 send 了不能 redirect 且 ajax 不支援 redirect
    });
});
router.post('/register/stu', function (req, res, next) {
    var ssNum = req.body.account;
    var pwd = req.body.password;
    console.log(ssNum,pwd);

    rest.post('http://webservice1.ltu.edu.tw/ltu.asmx/checkLdapIdno', {
        data: {
            userName: ssNum,
            password: pwd

        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        parser: rest.parsers.xml
    }).on('success', function (data) {

        console.log(data);
        try {
            var result = data.string._;
            console.log("result:" + result);
            if (result === "true") {
                console.log("t_result:" + result);

                return res.send({success: true});
            } else {
                console.log("f_result:" + result);

                return res.send({success: false, message: '登入失敗'}); // try

            }

        } catch (ex) {
            console.log('exception', ex);
            return res.send({success: false, message: '發生錯誤'});
        }
    }).on('fail', function (error) {
        console.error(error);
        return res.send({success: false, message: '發生錯誤'}); //OK 了 你前端怎麼呼叫?
        //已經 send 了不能 redirect 且 ajax 不支援 redirect
    });
});


module.exports = router;