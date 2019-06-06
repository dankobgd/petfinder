const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const config = require('../config');

const njk = new nunjucks.Environment();

function hoursFromMS(ms) {
  const hours = Math.round((Number.parseInt(ms, 10) / 1000 / 60 / 60) * 100) / 100;
  return hours === 1 ? `${hours} hour` : `${hours} hours`;
}

njk.addGlobal('signatureAddress', config.email.signatureAddress);
njk.addGlobal('resetPasswordValidFor', hoursFromMS(config.auth.resetPasswordValidFor));

function compileTemplate(templateName, data = {}) {
  return new Promise((resolve, reject) => {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
    fs.readFile(templatePath, 'utf-8', (err, source) => {
      if (err) {
        return reject(err);
      }

      const compiled = njk.renderString(source, data);
      return resolve(compiled);
    });
  });
}

module.exports = compileTemplate;
