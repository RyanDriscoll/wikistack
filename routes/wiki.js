var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res) {
    Page.findAll()
    .then(function(pagesReturned) {
        console.log(pagesReturned)
        res.render('index', {pages: pagesReturned});
    })
});


router.post('/', function(req, res) {
    var pageInfo = req.body;
    var page = Page.build( {
        title: pageInfo.title,
        content: pageInfo.content
    })

    page.save().then(function(pageSaved){
        console.log("pagesaved", pageSaved.urlTitle);
        res.redirect(pageSaved.urlTitle);
    });
});

router.get('/add', function(req, res) {
    res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next) {
    var url = req.params.urlTitle;
    Page.findOne({
        where: {
            urlTitle: url
        }
    })
    .then(function(page) {
        res.render('wikipage', {page: page});
    })
    .catch(next);
    // res.send(req.params.urlTitle);
})





module.exports = router;
