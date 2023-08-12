require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const router = require('./routes');
const errorHandler = require('./middlewares/error');
const NotFoundError = require('./errors/not-found-error');

const allowedCors = [
  'http://alekseynikulin-front15.nomoreparties.co',
  'https://alekseynikulin-front15.nomoreparties.co',
  'http://localhost:3000',
  'https://localhost:3000',
];

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/mestodb')
  .then(() => console.log('Подключился к БД'))
  .catch(() => console.log('Ошибка при подключении к БД'));

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: allowedCors,
    credentials: true,
  }),
);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use((next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`слушаю ${PORT} порт`);
});
