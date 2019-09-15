const sgMail = require("@sendgrid/mail");
const keys = require("../config/keys");

class Mailer {
  constructor({ subject, recipients }, content) {
    sgMail.setApiKey(keys.sendGridKey);
    this.msg = {
      to: recipients.map(({ email }) => email),
      from: "no-reply@emaily.com",
      subject: subject,
      html: content,
      trackingSettings: {
        clickTracking: {
          enable: true
        }
      }
    };
  }

  async send() {
    const result = await sgMail.send(this.msg);
    return result;
  }
}

module.exports = Mailer;
