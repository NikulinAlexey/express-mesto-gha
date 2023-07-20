const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res
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
        card.deleteOne()
          .then(() => {
            res
              .send(card);
          })
          .catch(next);
      }
    })
    .catch(next);
};

const addLikeToCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      res
        .status(201)
        .send(card);
    })
    .catch(next);
};

const removeLikeFromCard = (req, res, next) => {
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
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((likes) => {
      res
        .send(likes);
    })
    .catch(next);
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  addLikeToCard,
  removeLikeFromCard,
};
