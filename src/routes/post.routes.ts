import { validateRequest } from './../middlewares/validateRequest';
import { createPost, deletePost, getOnePost } from './../controllers/post.controller';
import { body } from 'express-validator';
import { Router } from "express"

export const postRouter = Router()

postRouter.get('/:ID', getOnePost)

postRouter.post('/',
    body("title").trim().isString().notEmpty().withMessage("Campo requerido"),
    body("description").trim().isString().notEmpty().withMessage("Campo requerido"),
    body("categoryId").trim().isNumeric().notEmpty().withMessage("Campo requerido"),
    body("userId").trim().isString().notEmpty().withMessage("Campo requerido"),

    validateRequest, createPost)

postRouter.delete('/:ID', deletePost)