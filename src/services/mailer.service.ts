import SendGrid from '@sendgrid/mail'

import { MailerRepository } from '../core/repositories'

export class MailerService implements MailerRepository {
  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY!)
  }

  async send(mail: SendGrid.MailDataRequired): Promise<void> {
    await SendGrid.send(mail)
  }
}
