const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ForbiddenError = require('../errors/forbidden-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    res.status(409).send({ message: 'Такой email уже есть в базе' });
  } if (err instanceof UnauthorizedError) {
    // statusCode(401)
    res.status(err.statusCode).send({ message: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(err.statusCode).send({ message: err.message });
  } else if (err instanceof ValidationError) {
    // statusCode(400)
    res.status(err.statusCode).send({ message: err.message });
  } else if (err instanceof ForbiddenError) {
    // statusCode(403)
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }

  next();
};

module.exports = errorHandler;
