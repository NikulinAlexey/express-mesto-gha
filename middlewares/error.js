const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    res.status(409).send({ message: 'Такой email уже есть в базе' });
  } else if (err instanceof Error) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
  next();
};

module.exports = errorHandler;
