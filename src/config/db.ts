import { PrismaClient } from '@prisma/client'

declare namespace NodeJS {
  interface Global {
    prisma: PrismaClient
  }
}

declare const global: NodeJS.Global & typeof globalThis

// Singleton instance of PrismaClient

export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') global.prisma = prisma
