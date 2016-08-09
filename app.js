var express = require('express');
var app = express();
var swig = require('swig');
var morgan = require('morgan');
var bodyparser = require('body-parser');
var models = require('./models')
var wikiRouter = require('./routes/wiki');
var userRouter = require('./routes/user')

swig.setDefaults({cache: false});
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded( { extended: false }));
app.use('/wiki', wikiRouter);
app.use('/user', userRouter);

app.get('/', function(req, res){
    res.send('<h1>THIS IS THE ROOT, NOT THE WIKI INDEX</h1>');
})



models.User.sync()
    .then(function () {
        return models.Page.sync()
    })
    .then(function () {
        app.listen(5432, function () {
            console.log('Server is listening on port 5432!');
        });
    })
    .catch(console.error);


app.listen(3000);

