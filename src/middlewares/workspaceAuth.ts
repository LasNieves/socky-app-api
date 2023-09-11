import { Request, Response, NextFunction } from 'express'

import { WorkspaceRole } from '../core/enums'

import { CustomError, NotAuthorized, NotFound } from '../errors'
import { categoryService, postService, userService } from '../services'

type ValidateBy = 'workspaceId' | 'categoryId' | 'postId'

export const workspaceAuthorization =
  (validateBy: ValidateBy, ...roles: WorkspaceRole[]) =>
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

      if (!category) {
        return next(
          new NotFound(`La categoría con id ${ID} no se ha encontrado`)
        )
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

    try {
      const userRole = await userService.getUserRoleInWorkspace(userId, id)

      if (!roles.includes(userRole)) {
        throw new NotAuthorized('Usuario no autorizado')
      }

      req.workspaceId = id
      return next()
    } catch (err) {
      return next(err)
    }
  }
