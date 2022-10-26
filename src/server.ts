import express, { json } from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import { router } from './routes/router'

dotenv.config()

const PORT = process.env.PORT || 3000

const server = express()

server.use(json())
server.use(cors())

server.use('/api/v1', router)

server.get('/', (_req, res) => {
  res.status(200).send('Iniciar el servidor en el endpoint: api/v1/entity')
})

server.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`)
})
