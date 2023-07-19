const router = require('express').Router();
const {
  validateGetUserById,
  validateUpdateProfile,
  validateUpdateAvatar,
} = require('../validation-constatns/validation-constatns');

const {
  getUsers,
  getUserById,
  updateAvatar,
  updateProfile,
  getCurrentUser,
} = require('../controllers/users');

router.get('', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', validateGetUserById, getUserById);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
