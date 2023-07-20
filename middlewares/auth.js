const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    return new UnauthorizedError('Ошибка авторизации');
  }

  req.user = payload;

  return next();
};

module.exports = auth;
