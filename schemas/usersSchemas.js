import Joi from "joi"

const registerSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
})

const loginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required()
})

const emailSchema = Joi.object({
    email: Joi.string().required(),
})

export const schema = {
    registerSchema,
    loginSchema,
    emailSchema
}