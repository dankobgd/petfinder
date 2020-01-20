const nodemailer = require('nodemailer');
const sendgrid = require('@sendgrid/mail');
const mailgun = require('mailgun-js');
const juice = require('juice');
const htmlToText = require('html-to-text');
const compileTemplate = require('../utils/compile-template');
const config = require('../config');

async function generateHTML(templateName, context = {}) {
  const compiledTemplate = await compileTemplate(templateName, context);
  const inlined = juice(compiledTemplate);
  return inlined;
}

async function sendSMTP(transport, mailOptions) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(transport);

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return reject(err);
      return resolve(info);
    });
  });
}

async function sendSendgrid(mailOptions) {
  return new Promise((resolve, reject) => {
    sendgrid.setApiKey(config.email.sendgrid.apiKey);
    return resolve(sendgrid.send(mailOptions));
  });
}

async function sendMailgun(mailOptions) {
  return new Promise((resolve, reject) => {
    const { apiKey, domain } = config.email.mailgun;
    const mg = mailgun({ apiKey, domain });

    mg.messages().send(mailOptions, (err, body) => {
      if (err) return reject(err);
      return resolve(body);
    });
  });
}

module.exports.send = async function(templateName, opts) {
  const html = await generateHTML(templateName, opts);
  const text = htmlToText.fromString(html);

  if (config.isProductionMode() && !config.email.enabled) {
    throw new Error("Can't send emails, mailer is not enabled in production mode");
  }

  if (opts.to === null || opts.to === undefined) {
    throw new Error('Missing property `to` for the email');
  }

  const mailOptions = {
    from: opts.from || `${config.app.title} <${config.email.from}>`,
    to: opts.to,
    subject: opts.subject || 'No Subject',
    text,
    html,
  };

  if (config.email.transport === 'smtp') {
    await sendSMTP(config.email.smtp, mailOptions);
  } else if (config.email.transport === 'mailgun') {
    await sendMailgun(mailOptions);
  } else if (config.email.transport === 'sendgrid') {
    await sendSendgrid(mailOptions);
  } else {
    throw new Error('Unsupported email transport provided');
  }
};
