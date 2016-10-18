import * as express from "express";
import { join } from "path";
import * as favicon from "serve-favicon";
import { json, urlencoded } from "body-parser";
import { exec } from "child_process"

import { loginRouter } from "./routes/login";
import { bookingsRouter } from "./routes/bookings";

const app: express.Application = express();
app.disable("x-powered-by");

// favicon
app.use("/", favicon(join(__dirname, "../public", "favicon.ico")));

// all user app routes:
app.use("/pt", express.static(join(__dirname, '../public')));
app.use("/pt/main", express.static(join(__dirname, '../public')));
app.use("/pt/export", express.static(join(__dirname, '../public')));

// main app files route
app.use("/pt/client", express.static(join(__dirname, "../client")));

app.use(json());
app.use(urlencoded({ extended: true }));

// api routes
app.use("/pt/api/login", loginRouter);
app.use("/pt/api/bookings", bookingsRouter);

// error handlers
// development error handler
// will print stacktrace
//if (app.get("env") === "development") {

    app.use("/pt/node_modules", express.static(join(__dirname, "../node_modules")));
    app.use(express.static(join(__dirname, "../tools")));

    app.use(function(err, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(err.status || 500);
        res.json({
            error: err,
            message: err.message
        });
    });

    // update route:
    app.get('/pt/update', function(req: express.Request, res: express.Response) {
        exec('git pull', function(err, stdout, stderr) {
            if (err) res.send(err);
            else res.send(stdout);
        });
    });

//}

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next) {
    let err = new Error("Not Found");
    next(err);
});

// production error handler
// no stacktrace leaked to user
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.json({
        error: {},
        message: err.message
    });
});

export { app }
