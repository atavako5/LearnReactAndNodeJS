const mongoose = require("mongoose");
const express = require("express");
const requireCredits = require("../middlewares/requireCredits");
var router = express.Router();
const Mailer = require("../services/Mailer");
const Survey = mongoose.model("surveys");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");
const requireLogin = require("../middlewares/requireLogin");
const _ = require("lodash");
const Path = require("path-parser").default;
const { URL } = require("url");

router.get("/", requireLogin, async (req, res) => {
  const surveys = await Survey.find({ _user: req.user.id }).select({
    recipients: false
  });

  res.send(surveys);
});

router.get("/:surveyId/:choice", (req, res) => {
  res.send("Thanks for voting!");
});

router.post("/webhooks", (req, res) => {
  const p = new Path("/api/surveys/:surveyId/:choice");
  _.chain(req.body)
    .map(({ email, url }) => {
      const match = p.test(new URL(url).pathname);
      if (match) {
        return { email, surveyId: match.surveyId, choice: match.choice };
      }
    })
    .compact()
    .uniqBy("email", "surveyId")
    .each(({ surveyId, email, choice }) => {
      Survey.updateOne(
        {
          _id: surveyId,
          recipients: {
            $elemMatch: { email: email, responded: false }
          }
        },
        {
          $inc: { [choice]: 1 },
          $set: { "recipients.$.responded": true }
        }
      ).exec();
    })
    .value();
  res.send({});
});

router.post("/", requireLogin, requireCredits, async (req, res) => {
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
