const mongoose = require('mongoose');

function isRegExValid(v) {
  return /^https?:\/\/[www]?(.[\w,-]{1,}.?){1,}/.test(v);
}

const cardLinkValidator = [isRegExValid, 'Ссылка на картинку невалидна'];

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: cardLinkValidator,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: mongoose.Schema.Types.Array,
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

cardSchema.methods.isCardOwner = function (card, userId) {
  const { owner } = card;

  if (owner === userId) {
    return true;
  }

  return false;
};

module.exports = mongoose.model('card', cardSchema);
