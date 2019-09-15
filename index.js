const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const mongoose = require("mongoose");
const keys = require("./config/keys");
require("./models/User");
require("./models/Surveys");
require("./services/passport");
var auth = require("./routes/authRoutes");
var api = require("./routes/apiRoutes");
const bodyParser = require("body-parser");

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
console.log("Connected to mongoose database!");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());

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

if (process.env.NODE_ENV == "production") {
  // ORDER MATTERS
  // express will serve up production assets
  // i.e. main.js
  app.use(express.static("client/build"));

  // express will serve up index.html file
  // if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendfile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT);
console.log("Listening to port " + PORT + "!");
