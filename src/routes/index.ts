import { Router } from 'express'

import { authRouter } from './auth.routes'
import { categoryRouter } from './category.routes'
import { postRouter } from './post.routes'
import { usersRouter } from './user.routes'
import { workspaceRouter } from './workspace.routes'

const router = Router()

router.use('/users', usersRouter)
router.use('/auth', authRouter)
router.use('/workspaces', workspaceRouter)
router.use('/categories', categoryRouter)
router.use('/posts', postRouter)

export default router
