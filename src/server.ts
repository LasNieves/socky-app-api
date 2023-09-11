import express, { json } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import * as dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

import handlers from './routes'
import { deleteWorkspacesWithoutUsers, deleteUsedOrExpiresCodes } from './crons'
import { errorHandler } from './middlewares'
import { options } from './doc/swagger.config'

dotenv.config()

const PORT = process.env.PORT || 3000

const server = express()

server.use(json())
server.use(cors())
server.use(morgan('tiny'))

server.use('/api/v1', handlers)

server.use(errorHandler)

server.get('/', (_req, res) => {
  res.status(200).send('Iniciar el servidor en el endpoint: /api/v1/entity')
})

server.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc(options), {
    explorer: true,
    customSiteTitle: 'SockyApp Documentation',
  })
)

server.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`)
  deleteWorkspacesWithoutUsers.start()
  deleteUsedOrExpiresCodes.start()
})
