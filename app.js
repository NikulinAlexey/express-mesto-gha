require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const router = require('./routes');
const errorHandler = require('./middlewares/error');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/mestodb')
  .then(() => console.log('Подключился к БД :)'))
  .catch(() => console.log('Ошибка при подключении к БД :('));

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ['https://alekseyNikulin-front15.nomoreparties.co', process.env.BASE_URL],
  credentials: true,
}), router);

app.use(router);

app.use((next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`слушаю ${PORT} порт`);
});
