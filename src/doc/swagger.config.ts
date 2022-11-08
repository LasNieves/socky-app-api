import path from 'path'

export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SockyApp Express API Documentation',
      version: '0.1.0',
      description:
        'SockyApp allows their users and teams to handle predefined text that use daily as a piece of cake',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'SockyApp',
        url: 'https://google.com',
        email: 'info@email.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
      },
    ],
  },
  apis: [
    `${path.join(__dirname, './../core/entities/*.entity.ts')}`,
    `${path.join(__dirname, './../routes/*.routes.ts')}`,
  ],
}
