const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }

      res.send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      if (user) {
        res
          .send(user);
      }
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const currentUserId = req.user._id;

  User.findById(currentUserId)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  // Обновление пользователя
  User.findByIdAndUpdate(
    _id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { avatar },
    { new: true },
  )
    .orFail(() => new Error('Not found'))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send({ user });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  updateAvatar,
  updateProfile,
  getCurrentUser,
};
