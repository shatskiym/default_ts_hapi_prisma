import Joi from "joi";

export const AUTH_SCHEMA = {
  payload: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const REFRESH_SCHEMA = {
  payload: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

export const SUCCESS_AUTH_SCHEMA = Joi.object({
  authToken: Joi.string(),
  refreshToken: Joi.string(),
  email: Joi.string().email(),
}).label("Result");

export const ERROR_RESPONSE_SCHEMA = Joi.any();