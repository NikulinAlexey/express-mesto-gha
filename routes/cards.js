const router = require('express').Router();

const {
  validateCreateCard,
  validateDeleteCard,
  validateAddLikeToCard,
  validateRemoveLikeFromCard,
} = require('../validation-constatns/validation-constatns');

const {
  getCards,
  createCard,
  deleteCard,
  addLikeToCard,
  removeLikeFromCard,
} = require('../controllers/cards');

router.get('', getCards);
router.post('', validateCreateCard, createCard);
router.delete('/:cardId', validateDeleteCard, deleteCard);
router.put('/:cardId/likes', validateAddLikeToCard, addLikeToCard);
router.delete('/:cardId/likes', validateRemoveLikeFromCard, removeLikeFromCard);

module.exports = router;
