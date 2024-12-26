"use strict";

/** Express app for jobly. */

const express = require("express");
console.log('required express')
const cors = require("cors");
console.log('required cors')

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
console.log('required authenticateJWT')
const authRoutes = require("./routes/auth");
const companiesRoutes = require("./routes/companies");
console.log('required companiesRoutes')
const usersRoutes = require("./routes/users");
const jobsRoutes = require("./routes/jobs");

const morgan = require("morgan");
console.log('required morgan and other routes')
const app = express();

try{
  app.use(cors());
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use(authenticateJWT);
  }catch(e){
    console.log(e)
  }

  try{
    app.use("/auth", authRoutes);
    app.use("/companies", companiesRoutes);
    app.use("/users", usersRoutes);
    app.use("/jobs", jobsRoutes);
  }catch(e){
    console.log('second 4')
    console.log(e)
  }
console.log('routes succeeded')


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});
console.log('handle 404 succeeded')
/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});
console.log('generic errors succeeded')
module.exports = app;
