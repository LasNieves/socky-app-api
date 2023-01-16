import { Request, Response, NextFunction } from 'express'

import { categoryService } from '../controllers/category.controller'
import { postService } from '../controllers/post.controller'
import { userService } from '../controllers/user.controller'

import { CustomError, NotAuthorized } from '../errors'

type ValidateBy = 'workspaceId' | 'categoryId' | 'postId'

export const workspaceAuthorization =
  (validateBy: ValidateBy, ...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { ID } = req.params

    let id: string = ''

    if (validateBy === 'workspaceId') {
      const { workspaceId } = req.body

      id = workspaceId ?? ID
    }

    if (validateBy === 'categoryId') {
      const { categoryId } = req.body

      const category = await categoryService.get(categoryId ?? +ID)

      if (category instanceof CustomError) {
        return next(category)
      }

      id = category.workspaceId
    }

    if (validateBy === 'postId') {
      const { postId } = req.body

      const post = await postService.get(postId ?? ID)

      if (post instanceof CustomError) {
        return next(post)
      }

      id = post.category.workspaceId
    }

    const { id: userId } = req.user!

    const userRole = await userService.getUserRole(userId, id)

    if (userRole instanceof CustomError) {
      return next(userRole)
    }

    if (roles.includes(userRole)) {
      req.workspaceId = id
      return next()
    }

    return next(new NotAuthorized('Usuario no autorizado'))
  }
