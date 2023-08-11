const router = require('express').Router();
const { errors } = require('celebrate');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

const auth = require('../middlewares/auth');

const {
  errorLogger,
  requestLogger,
} = require('../middlewares/logger');
const {
  login,
  createUser,
} = require('../controllers/auth');
const {
  validateLogin,
  validateСreateUser,
} = require('../validation-constatns/validation-constatns');

router.use(requestLogger);

router.use('/signin', validateLogin, login);
router.use('/signup', validateСreateUser, createUser);

router.use(auth);

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);

router.use(errorLogger);

router.use(errors());

module.exports = router;
