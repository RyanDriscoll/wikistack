var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res) {
    Page.findAll()
        .then(function(pagesReturned) {
            res.render('index', {
                pages: pagesReturned
            });
        })
});


router.post('/', function(req, res) {
    var pageInfo = req.body;
    var user;
    User.findOrCreate({
            where: {
                email: pageInfo.email
            },
            defaults: {
                name: pageInfo.name,
                email: pageInfo.email
            }
        })
        .spread(function(user, created) {
            return Page.create({
                title: pageInfo.title,
                content: pageInfo.content,
            })
            .then(function(page) {

                return page.setAuthor(user)
            })
            .then(function(updatedPage) {
                res.redirect(updatedPage.urlTitle);
            })
        })
        .catch(next)

    // .then(function(page) {
    //     page.setAuthor(user);
    // });
});

router.get('/add', function(req, res) {
    res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next) {
    var url = req.params.urlTitle;
    Page.findOne({
            where: {
                urlTitle: url
            },
            include: [
                {model: User, as: 'author'}
            ]
        })
        .then(function(page) {
            res.render('wikipage', {
                page: page
            });
        })
        .catch(next);
    // res.send(req.params.urlTitle);
})



module.exports = router;
