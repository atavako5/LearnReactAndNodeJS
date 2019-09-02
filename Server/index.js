const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const mongoose = require("mongoose");
const keys = require("./config/keys");
var auth = require("./routes/authRoutes");
var api = require("./routes/apiRoutes");
require("./models/User");
require("./services/passport");

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
console.log("Connected to mongoose database!");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", auth);
app.use("/api", api);

app.listen(PORT);
console.log("Listening to port " + PORT + "!");
