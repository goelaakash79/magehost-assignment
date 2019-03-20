const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const request = require('request');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/feed',
    failureRedirect: '/login'
}), function (req, res) {
});

router.get('/logout', (req, res) => {
    req.logout();
    res.render('login', {message: 'You are logged out successfully'});
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.render('login', {message: 'Login Again!'});
}

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    User.findOne({email: req.body.email}, (err, exists) => {
        if (err) throw err;
        if (exists) {
            res.render('register', {errors: [{msg: 'User already exists, try using different Email Id.'}]});
        } else {

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    password = hash;
                    let user_data = {
                        username: req.body.username,
                        email: req.body.email,
                        password: password
                    };
                    User.create(user_data, (err, userData) => {
                        if (err) throw err;
                        res.render('login', {message: 'You are registered, please verify your email, then login.'});
                    })
                });
            });
        }
    });
})
;

router.get('/feed', isAuthenticated, (req, res) => {
    let url = process.env.URL;
    let username = req.user.username;
    url += 'search?tags=story';
    request(url, (error, response, body) => {
        if(!error && response.statusCode == 200) {
            let news = JSON.parse(body);
            res.render('index', {username: username, news: news.hits, pages: news.nbPages});
        }
    });
});

router.post('/feed', isAuthenticated, (req, res) => {
    let username = req.user.username;
    console.log(req.body);
    let url = process.env.URL + 'search?';
    if(req.body.query) {
        url += `query=${req.body.query}`;
    }
    if(req.body.tag) {
        url += `tags=${req.body.tag}` + `&page=10`;
    }
    console.log(url);
    request(url, (error, response, body) => {
        if(!error && response.statusCode == 200) {
            let news = JSON.parse(body);
            res.render('index', {username: username, news: news.hits, pages: news.nbPages});
        }
    });
});

passport.use(new LocalStrategy(function (username, password, done) {
    let pass = password;
    User.findOne({username: username}, (err, userData) => {
        if (err) throw err;
        if (!userData) {
            return done(null, false, {message: 'Unknown User'});
        }
        let hash = userData.password;
        bcrypt.compare(pass, hash, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                return done(null, userData);
            } else {
                return done(null, false, {message: 'Invalid password'});
            }
        });
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

module.exports = router;