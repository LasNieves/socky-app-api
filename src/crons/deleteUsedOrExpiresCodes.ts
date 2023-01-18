import cron from 'node-cron'

import { prisma } from '../config/db'

export const deleteUsedOrExpiresCodes = cron.schedule(
  '0 1 28 * *',
  async () => {
    console.log('Running Task 2')

    const codes = await prisma.code.findMany()

    const codesToDelete = codes
      .filter((code) => code.used || code.expiresAt < new Date())
      .map((code) => code.id)

    await prisma.code.deleteMany({
      where: {
        id: {
          in: codesToDelete,
        },
      },
    })
  },
  {
    timezone: process.env.TIMEZONE,
  }
)
