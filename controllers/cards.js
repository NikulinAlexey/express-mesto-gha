const Card = require('../models/card');

const {
  DEFAULT_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INVALID_PARAMS_ERROR_CODE,
} = require('../errors/error-codes');

const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

// исправить обработку ошибок у карточек
const getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => new NotFoundError('Карточки не найдены'))
    .then((cards) => {
      res
        .status(200)
        .send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link, likes } = req.body;
  const owner = req.user._id;

  Card.create({
    name,
    link,
    likes,
    owner,
  })
    .then((card) => {
      res
        .send({ card });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      const owner = card.owner.toString();

      if (owner !== userId) {
        throw new ForbiddenError('Можно удалить только свою карточку');
      } else {
        card.deleteOne();
        res.send(card);
      }
    })
    .catch(next);
};

const addLikeToCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => {
      res
        .status(201)
        .send(card);
    })
    .catch((err) => {
      if (err.message.includes('Not found')) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({
            message: 'Добавление лайка с несуществующим в БД id карточки',
          });
      } else if (err.message.includes('Cast to ObjectId failed for value')) {
        res
          .status(INVALID_PARAMS_ERROR_CODE)
          .send({
            message: 'Добавление лайка с некорректным id карточки',
          });
      } else {
        res
          .status(DEFAULT_ERROR_CODE)
          .send({
            message: 'Произошла ошибка',
          });
      }
    });
};

const removeLikeFromCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new Error('Not found'))
    .then((likes) => {
      res
        .send(likes);
    })
    .catch((err) => {
      if (err.message.includes('Not found')) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({
            message: 'Удаление лайка у карточки с несуществующим в БД id',
          });
      } else if (err.message.includes('Cast to ObjectId failed for value')) {
        res
          .status(INVALID_PARAMS_ERROR_CODE)
          .send({
            message: 'Удаление лайка у карточки с некорректным id',
          });
      } else {
        res
          .status(DEFAULT_ERROR_CODE)
          .send({
            message: 'Произошла ошибка',
          });
      }
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  addLikeToCard,
  removeLikeFromCard,
};
