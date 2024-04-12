import SendGrid from '@sendgrid/mail'

export class MailerService {
  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY!)
  }

  async send(mail: SendGrid.MailDataRequired): Promise<void> {
    await SendGrid.send(mail)
  }
}

export const mailerService = new MailerService()
