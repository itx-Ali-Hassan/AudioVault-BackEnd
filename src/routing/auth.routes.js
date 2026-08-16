const express = require('express')

const authMiddleware = require('../middleware/auth.middleware')
const { registerUser, loginUser, updateProfile, getUserProfile, logoutUser } = require('../controllers/auth.controller')
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', authMiddleware, logoutUser)
router.route('/profile').get(authMiddleware, getUserProfile).put(authMiddleware, updateProfile)

module.exports = router