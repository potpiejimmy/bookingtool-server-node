import * as express from "express";
import { join } from "path";
import * as favicon from "serve-favicon";
import { json, urlencoded } from "body-parser";
import { exec } from "child_process"

import { loginRouter } from "./routes/login";
import { bookingsRouter } from "./routes/bookings";
import { templatesRouter } from "./routes/templates";
import { budgetsRouter } from "./routes/budgets";

import * as auth from "./util/auth";

const app: express.Application = express();

// configure express:
app.disable("x-powered-by");
app.use(json());
app.use(urlencoded({ extended: true }));

// favicon
app.use("/", favicon(join(__dirname, "../public", "favicon.ico")));

// all public user app routes:
let publicRoute = express.static(join(__dirname, '../public'));
app.use("/pt", publicRoute);
app.use("/pt/main", publicRoute);
app.use("/pt/export", publicRoute);

// main app files route
app.use("/pt/client", express.static(join(__dirname, "../client")));

// verifies the jwt for protected API routes
let verifyTokenMiddleware = auth.verifyToken();

// api routes
app.use("/pt/api/login", loginRouter);
app.use("/pt/api/bookings", verifyTokenMiddleware, bookingsRouter);
app.use("/pt/api/templates", verifyTokenMiddleware, templatesRouter);
app.use("/pt/api/budgets", /*verifyTokenMiddleware,*/ budgetsRouter);

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
