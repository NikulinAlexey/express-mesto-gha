const jsonWebToken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const UnauthorizedError = require('../errors/unauthorized-error');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => new UnauthorizedError('Неправльная почта или пароль'))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            // создаю токен
            const jwt = jsonWebToken.sign({
              _id: user._id,
            }, 'SECRET');

            // Зашиваю токен в куку
            res.cookie('jwt', jwt, { maxAge: 360000, httpOnly: true, sameSite: true });
            res.send(user);
          } else {
            throw new UnauthorizedError('Неправильная почта или пароль');
          }
        });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    email,
    avatar,
    password,
  } = req.body;

  bcrypt.hash(String(password), 10)
    .then((hashedPassword) => {
      User.create({
        name,
        about,
        email,
        avatar,
        password: hashedPassword,
      })
        .then((user) => {
          res.status(201).send({ data: user });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  login,
  createUser,
};
