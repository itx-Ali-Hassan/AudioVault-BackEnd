const userModel = require('../models/user.model')

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select('-password')

        res.status(200).json({ message: 'All users fetched successfully', users })
    } catch (error) {
        console.log('Got an error while fetching the users', error.message)
        res.status(500).json({ message: 'Got an error while fetching the users' })
    }
}

const deleteUser = async (req, res) => { }

const updateUserRole = async (req, res) => { }

const dashBoardStats = async (req, res) => { }

module.exports = { getAllUsers, deleteUser, updateUserRole, dashBoardStats }