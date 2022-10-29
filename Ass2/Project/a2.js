/**
 * The file to start a server
 *
 */

var express = require('express');
var path = require('path');
var session = require('express-session');
var dotenv = require('dotenv');
dotenv.config('./env');
var a2Routes = require('./app/routes/a2.server.routes');
var bodyParser = require('body-parser');
var app = express();

app.locals.cartRecordingMap = new Map();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.set('views', path.join(__dirname,'/app/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(session(
    {
        secret: 'ssshhhh',
        cookie: {maxAge: 6000000, secure: false },
        resave: true,
        saveUninitialized: true

    }
));
app.use('/',a2Routes);

app.listen(3000, function () {
	console.log('A2 app listening on port 3000!')
}); 
	
module.exports = app;