const passport = require("passport");
const express = require("express");
var router = express.Router();
const keys = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");
const stripe = require("stripe")(keys.stripeSecretKey);

router.use(requireLogin);

router.get("/current_user", (req, res) => {
  res.send(req.user);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.post("/stripe", async (req, res) => {
  const charge = await stripe.charges.create({
    amount: 500,
    currency: "usd",
    description: "$5 for 5 credits",
    source: req.body.id
  });
  req.user.credits += 5;

  const user = await req.user.save();

  res.send(user);
});

module.exports = router;
