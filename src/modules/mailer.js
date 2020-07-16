const path = require('path');
const nodemailer = require('nodemailer');
const {host, port, user, pass} = require('../config/mail.json');
const hbs = require('nodemailer-express-handlebars');


  const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  });

  transport.use('compile', hbs({
    viewEngine: 'handlebars',
    vewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  }));

  module.exports = transport;