import * as SendGrid from '@sendgrid/mail'

export interface MailerRepository {
  send: (mail: SendGrid.MailDataRequired) => Promise<void>
}
