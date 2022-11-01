import { getCategoriesByWorkspace } from './../controllers/category.controller';
import { Router } from 'express'

export const categoryRouter = Router()

categoryRouter.get('/:ID', getCategoriesByWorkspace)
