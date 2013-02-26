
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , everyauth = require('everyauth');

everyauth.debug = true;
everyauth.github
  .appId(process.env.GITHUB_CLIENT_ID)
  .appSecret(process.env.GITHUB_CLIENT_SECRET)
  .entryPath('/auth/github')
  .callbackPath('/auth/github/callback')
  .scope('repo:status,notifications')
  .findOrCreateUser(function(session, activeToken, accessTokenExtra, githubUser) {
    console.log(arguments);
  })
  .redirectPath('/');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: process.env.SESSION_SECRET }));
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(everyauth.middleware());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});