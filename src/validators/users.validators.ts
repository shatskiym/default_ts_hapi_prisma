import Joi from "joi";

export const GET_USERS_VALIDATION_SCHEMA = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}

export const GET_USERS_SUCCESS_RESPONSE_SCHEMA = Joi.array().items({
  id: Joi.number().integer().required(),
  email: Joi.string().required(),
  encryptedPassword: Joi.string().required(),
}).required();

export const GET_USER_SUCCESS_RESPONSE_SCHEMA = Joi.object({
  id: Joi.number().integer().required(),
  email: Joi.string().required(),
  firstName: Joi.string().required().allow(null),
  lastName: Joi.string().required().allow(null),
}).required();

export const UPDATE_USER_REQUEST_SCHEMA = {
  payload: Joi.object({
    email: Joi.string().email(),
    firstName: Joi.string(),
    lastName: Joi.string(),
  })
    .or("email", "firstName", "lastName")
    .required(),
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
};

export const UPDATE_USER_SUCCESS_RESPONSE_SCHEMA = Joi.object({
  id: Joi.number().integer().required(),
  email: Joi.string().required(),
  firstName: Joi.string().required().allow(null),
  lastName: Joi.string().required().allow(null),
  authToken: Joi.string().required(),
  refreshToken: Joi.string().required(),
}).required();

export const ERROR_RESPONSE_SCHEMA = Joi.any();