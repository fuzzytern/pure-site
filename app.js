var express = require('express'),
    exphbs  = require('express3-handlebars'),
    path    = require('path'),

    config     = require('./config'),
    helpers    = require('./lib/helpers'),
    middleware = require('./lib/middleware'),
    routes     = require('./lib/routes'),

    app = express();

// -- Config -------------------------------------------------------------------

app.set('name', 'YUI CSS');
app.set('env', config.env);
app.set('port', config.port);
app.set('views', config.dirs.views);
app.set('view engine', 'handlebars');

app.enable('strict routing');

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers      : helpers,
    layoutsDir   : config.dirs.layouts,
    partialsDir  : config.dirs.partials
}));

app.locals({
    title: 'YUI CSS',
    yui  : config.yui,
    min  : config.isProduction ? '-min' : ''
});

// -- Middleware ---------------------------------------------------------------

if (config.isDevelopment) {
    app.use(express.logger('tiny'));
}

app.use(express.compress());
app.use(express.favicon(path.join(config.dirs.pub, 'favicon.ico')));
app.use(app.router);
app.use(middleware.slash);
app.use(express.static(config.dirs.pub));

if (config.isDevelopment) {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack     : true
    }));
}

// -- Routes -------------------------------------------------------------------

app.get('/', routes.home);

// -- Exports ------------------------------------------------------------------

module.exports = app;