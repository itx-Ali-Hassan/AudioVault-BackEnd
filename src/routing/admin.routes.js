const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/auth.middleware')
const isAdmin = require('../middleware/admin.middleware')
const { getAllUsers, deleteUser, updateUserRole, dashBoardStats } = require('../controllers/admin.controller')

router.get('/dashboard', authMiddleware, isAdmin, dashBoardStats)

router.get('/users', authMiddleware, isAdmin, getAllUsers)

router.route('/users/:id').get(authMiddleware, isAdmin, getAllUsers).delete(authMiddleware, isAdmin, deleteUser).put(authMiddleware, isAdmin, updateUserRole)

module.exports = router