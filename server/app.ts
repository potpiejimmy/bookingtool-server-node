import * as express from "express";
import { join } from "path";
import * as favicon from "serve-favicon";
import { json, urlencoded } from "body-parser";
import { exec } from "child_process"

import { loginRouter } from "./routes/login";
import { bookingsRouter } from "./routes/bookings";
import { templatesRouter } from "./routes/templates";
import { budgetsRouter } from "./routes/budgets";
import { usersRouter } from "./routes/users";

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
app.use("/pt2", publicRoute);
app.use("/pt2/about", publicRoute);
app.use("/pt2/pwchange", publicRoute);
app.use("/pt2/main", publicRoute);
app.use("/pt2/export", publicRoute);
app.use("/pt2/domains", publicRoute);
app.use("/pt2/projects", publicRoute);
app.use("/pt2/budgets", publicRoute);
app.use("/pt2/templates", publicRoute);
app.use("/pt2/adminfi", publicRoute);
app.use("/pt2/budgetcontrol", publicRoute);
app.use("/pt2/budgetplans", publicRoute);
app.use("/pt2/forecasts", publicRoute);
// redirect direct call to /login
app.get("/pt2/login", (req,res) => {res.redirect("/pt2")});

// main app files route
app.use("/pt2/client", express.static(join(__dirname, "../client")));

// verifies the jwt for protected API routes
let verifyTokenMiddleware = auth.verifyToken();

// api routes
app.use("/pt2/api/login", loginRouter);
app.use("/pt2/api/bookings", verifyTokenMiddleware, bookingsRouter);
app.use("/pt2/api/templates", verifyTokenMiddleware, templatesRouter);
app.use("/pt2/api/budgets", verifyTokenMiddleware, budgetsRouter);
app.use("/pt2/api/users", verifyTokenMiddleware, usersRouter);

// error handlers
// development error handler
// will print stacktrace
//if (app.get("env") === "development") {

    app.use("/pt2/node_modules", express.static(join(__dirname, "../node_modules")));
    app.use(express.static(join(__dirname, "../tools")));

    app.use(function(err, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(err.status || 500);
        res.json({
            error: err,
            message: err.message
        });
    });

    // update route:
    app.get('/pt2/update', function(req: express.Request, res: express.Response) {
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
