const router = require('express').Router();
const { authenticateToken } = require('../middlewares');
const { createUser, getUser, editUser, deleteCurrentUser } = require('../controllers').User;

// Handle the API request
router.post('/', createUser);
router.get('/', authenticateToken, getUser);
router.patch('/', authenticateToken, editUser);
router.delete('/', authenticateToken, deleteCurrentUser);

module.exports = router;
