const mongoose = require("mongoose");
const express = require("express");
const requireCredits = require("../middlewares/requireCredits");
var router = express.Router();
const Mailer = require("../services/Mailer");
const Survey = mongoose.model("surveys");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

router.get("/thanks", (req, res) => {
  res.send("Thanks for voting!");
});
router.post("/", requireCredits, async (req, res) => {
  const { title, subject, body, recipients } = req.body;
  const survey = new Survey({
    title,
    subject,
    body,
    recipients: recipients.split(",").map(email => ({ email: email.trim() })),
    _user: req.user.id,
    dateSent: Date.now()
  });
  // send email here
  const mailer = new Mailer(survey, surveyTemplate(survey));
  try {
    await mailer.send();
    await survey.save();
    req.user.credits -= 1;
    const user = await req.user.save();
    res.send(user);
  } catch (e) {
    res.status(422).send(err);
  }
});

module.exports = router;
