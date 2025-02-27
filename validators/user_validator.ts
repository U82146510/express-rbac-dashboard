import Joi from "joi";

export const register_Joi = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    role:Joi.string().required(),
    permissions:Joi.array().required()
});

export const login_Joi = Joi.object({
    email:Joi.string().required(),
    password:Joi.string().required()
});

export const page_query_Joi = Joi.object({
    page:Joi.number().default(1),
    limit:Joi.number().default(10)
});

export const update_password_role = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    role:Joi.string().default('user')
});