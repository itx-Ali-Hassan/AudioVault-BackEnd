const userModel = require('../models/user.model')
const audioModel = require('../models/audio.model')
const { destroyFromCloudinary } = require('../utils/cloudinaryFunctions.util')

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select('-password')
        res.status(200).json({ message: 'All users fetched successfully', users })
    } catch (error) {
        console.log('Got an error while fetching the users', error.message)
        res.status(500).json({ message: 'Got an error while fetching the users' })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (!user) return res.status(404).json({ message: 'User not found' })
        const audios = await audioModel.find({ userId: id })
        for (const audio of audios) {
            await destroyFromCloudinary(audio.audioPublicID, 'video')
            await destroyFromCloudinary(audio.coverPublicID, 'image')
        }
        await audioModel.deleteMany({ userId: id })
        await user.deleteOne()
        res.status(200).json({ message: 'User deleted successfully 😎' })
    } catch (error) {
        console.log('Got an error while deleting the user', error.message)
        res.status(500).json({ message: 'Got an error while deleting the user 😐' })
    }
}

const updateUserRole = async (req, res) => {
    const { id } = req.params
    const { role } = req.body
    try {
        const user = await userModel.findById(id)
        user.role = role || user.role
        await user.save()
        res.status(200).json({ message: 'User Role Updated successfully 😎', user })
    } catch (error) {
        console.log('Got an error while updating the role', error.message)
        res.status(500).json({ message: 'Got an error while updating the role 😐' })
    }
}

const dashBoardStats = async (req, res) => { }

module.exports = { getAllUsers, deleteUser, updateUserRole, dashBoardStats }