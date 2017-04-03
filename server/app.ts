import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import * as path from 'path';
import * as compression from 'compression';

import { loginRouter } from "./routes/login";
import { bookingsRouter } from "./routes/bookings";
import { templatesRouter } from "./routes/templates";
import { budgetsRouter } from "./routes/budgets";
import { usersRouter } from "./routes/users";

import * as auth from "./util/auth";

const app: express.Application = express();

app.disable('x-powered-by');

app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));

// verifies the jwt for protected API routes
let verifyTokenMiddleware = auth.verifyToken();

// api routes
app.use("/pt2/api/login", loginRouter);
app.use("/pt2/api/bookings", verifyTokenMiddleware, bookingsRouter);
app.use("/pt2/api/templates", verifyTokenMiddleware, templatesRouter);
app.use("/pt2/api/budgets", verifyTokenMiddleware, budgetsRouter);
app.use("/pt2/api/users", verifyTokenMiddleware, usersRouter);

if (app.get('env') === 'production') {

  // in production mode run application from dist folder
  app.use("/pt2", express.static(path.join(__dirname, '/../client')));
}

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next) {
  let err = new Error('Not Found');
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
