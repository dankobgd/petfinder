const nodemailer = require('nodemailer');
const juice = require('juice');
const htmlToText = require('html-to-text');
const compileTemplate = require('../utils/compile-template');
const config = require('../config');

async function generateHTML(templateName, context = {}) {
  const compiledTemplate = await compileTemplate(templateName, context);
  const inlined = juice(compiledTemplate);
  return inlined;
}

async function sendEmail(transport, mailOptions) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(transport);

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return reject(err);
      return resolve(info);
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

  await sendEmail(config.email.smtp, mailOptions);
};
