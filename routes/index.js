const router = require('express').Router();
const { errors } = require('celebrate');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

const auth = require('../middlewares/auth');

const { login, createUser } = require('../controllers/auth');
const { validateСreateUser, validateLogin } = require('../validation-constatns/validation-constatns');

router.use('/signup', validateСreateUser, createUser);
router.use('/signin', validateLogin, login);

router.use(auth);

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);

router.use(errors());

module.exports = router;
