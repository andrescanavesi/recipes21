const {logger} = require("./util/logger");
const log = new logger("app");

log.info("Is production environment: " + process.env.R21_IS_PRODUCTION);

const createError = require("http-errors");
const express = require("express");
const favicon = require("express-favicon");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const morganLogger = require("morgan");
const uuid = require("uuid/v4");
const compression = require("compression");

const indexRouter = require("./routes/index");
const recipeRouter = require("./routes/recipe");
const sitemapRouter = require("./routes/sitemap");

const useragent = require("express-useragent");

const app = express();
app.use(compression());

app.use(useragent.express());

if (process.env.R21_REDIRECT_TO_HTTPS === "true") {
    //auto-redirect to https in case we access through http
    const secure = require("ssl-express-www");
    app.use(secure);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(favicon(__dirname + "/public/images/favicon.png"));

app.use(morganLogger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// add & configure middleware
//TODO to use => cookie: { secure: true } in production
app.use(
    session({
        genid: req => {
            //log.info("Inside the session middleware");
            //log.info(req.sessionID);
            return uuid(); // use UUIDs for session IDs
        },
        secret: process.env.R21_SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use("/", indexRouter);
app.use("/recipe", recipeRouter);
app.use("/sitemap.xml", sitemapRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    if (req.app.get("env") === "test") {
        log.error(message);
    } else {
        log.error(err);
    }

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
