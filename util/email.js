const nodemailer = require('nodemailer')
const pug = require('pug')
const { htmlToText } = require('html-to-text')
const dotenv = require('dotenv')

dotenv.config({ path: './.env' })

class Email {
  constructor(emails) {
    this.emails = emails
    this.from = `Movies Lab < moviesdb@node.com >`
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_KEY
        }
      })
    }

    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
      }
    })
  }

  async send(template) {
    const html = pug.renderFile(
      `${__dirname}/../emails/${template}.pug`
    )
    await this.newTransport().sendMail({
      from: this.from,
      to: this.emails,
      html,
      text: htmlToText(html),
      subject: 'This is a test email'
    })
  }

  async sendWelcome() {
    await this.send('welcome')
  }
}

module.exports = { Email }
