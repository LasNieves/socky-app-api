import { Request, Response, NextFunction } from 'express'

import { WorkspaceRole } from '../core/enums'

import { BadRequest, NotAuthorized, NotFound } from '../errors'
import { categoryService, postService, userService } from '../services'
import { canCoerceToNumber } from '../utils'

type ValidateBy = 'workspaceId' | 'categoryId' | 'postId'

export const workspaceAuthorization =
  (validateBy: ValidateBy, ...roles: WorkspaceRole[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const { ID } = req.params

    let id: string = ''

    if (validateBy === 'workspaceId') {
      const { workspaceId } = req.body

      id = workspaceId ?? ID
    }

    if (validateBy === 'categoryId') {
      const { categoryId } = req.body
      if (!categoryId && !canCoerceToNumber(ID)) {
        return next(new BadRequest('El id de la categoría debe ser un número'))
      }

      const category = await categoryService.get({ id: categoryId ?? +ID })

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

      if (!post) {
        return next(new NotFound(`El post con id ${ID} no se ha encontrado`))
      }

      id = post!.category!.workspaceId
    }

    const { id: userId } = req.user!

    try {
      const userRole = await userService.getUserRoleInWorkspace(userId, id)

      if (!userRole) {
        return next(new NotAuthorized('No formas parte del workspace'))
      }

      if (!roles.includes(userRole)) {
        throw new NotAuthorized(
          'No posees el rol necesario dentro del workspace para realizar esta acción'
        )
      }

      req.workspaceId = id
      return next()
    } catch (err) {
      return next(err)
    }
  }
