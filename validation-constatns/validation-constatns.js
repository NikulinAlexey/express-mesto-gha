const { celebrate, Joi } = require('celebrate');

// Валидация запросов для users:
const validateGetUserById = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});
const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    about: Joi.string().min(2).required().max(30),
    name: Joi.string().required().min(2).max(30),
  }),
});
const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar:
      Joi.string()
        .required()
        .regex(/^https?:\/\/[www]?(.[\w,-]{1,}.?){1,}/)
        .message('Невалидная ссылка на аватар'),
  }),
});

// Валидация запросов для cards:
const validateCreateCard = celebrate({
  body: Joi.object().keys({
    link:
      Joi.string()
        .required()
        .regex(/^https?:\/\/[www]?(.[\w,-]{1,}.?){1,}/)
        .message('Невалидная ссылка на картинку'),
    name:
      Joi.string()
        .required()
        .min(2)
        .max(30),
  }),
});
const validateDeleteCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});
const validateAddLikeToCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});
const validateRemoveLikeFromCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

// Валидация запросов для авторизации, создания пользователя:
const validateСreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email:
      Joi.string()
        .required()
        .email()
        .message('Поле "email" должно быть валидным email-адресом')
        .messages({
          'string.required': 'Поле "email" должно быть заполнено',
        }),
    avatar:
      Joi.string()
        .regex(/^https?:\/\/[www]?(.[\w,-]{1,}.?){1,}/)
        .message('Невалидная ссылка на аватар'),
    password:
      Joi.string()
        .required()
        .messages({
          'string.empty': 'Поле "password" должно быть заполнено2',
        }),
  }),
});
const validateLogin = celebrate({
  body: Joi.object().keys({
    email:
      Joi.string()
        .required()
        .email()
        .message('Поле "email" должно быть валидным email-адресом')
        .messages({
          'string.required': 'Поле "email" должно быть заполнено',
        }),
    password:
      Joi.string()
        .required()
        .messages({
          'string.empty': 'Поле "password" должно быть заполнено2',
        }),
  }),
});

module.exports = {
  // Валидация запросов для /users:
  validateGetUserById,
  validateUpdateProfile,
  validateUpdateAvatar,
  // Валидация запросов для /cards:
  validateCreateCard,
  validateDeleteCard,
  validateAddLikeToCard,
  validateRemoveLikeFromCard,
  // Валидация запросов для авторизации, создания пользователя:
  validateСreateUser,
  validateLogin,
};
