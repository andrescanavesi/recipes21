const createError = require("http-errors");
const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const recipiesRouter = require("./routes/recipies");
const cacheRouter = require("./routes/cache");
const recipeRouter = require("./routes/recipe");
const sitemapRouter = require("./routes/sitemap");
const dashboardRouter = require("./routes/dashboard");
const ssoRouter = require("./routes/sso");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(favicon(__dirname + "/public/images/favicon.png"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/recipies", recipiesRouter);
app.use("/cache", cacheRouter);
app.use("/recipe", recipeRouter);
app.use("/sitemap.xml", sitemapRouter);
app.use("/dashboard", dashboardRouter);
app.use("/sso", ssoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    console.error(err);
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
