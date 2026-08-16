const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const UserModel = require('../models/user.model')

const createToken = (id, email) => { return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "30d" }) }

const registerUser = async (req, res) => {
    const { username, fullName, email, password } = req.body;
    if (!username || !fullName || !email || !password) return res.status(400).json({ error: 'All fields are required' })
    try {
        const existingEmail = await UserModel.findOne({ email });
        if (existingEmail) return res.status(409).json({ error: 'User with this email already exists' })

        const existingUsername = await UserModel.findOne({ username });
        if (existingUsername) return res.status(409).json({ error: 'This UserName is not available' })

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ username, fullName, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while registering the user' });
        console.log('error.message', error.message)
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

        user.status = "Login"
        await user.save()

        const token = await createToken(user._id, user.email);
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 30 * 24 * 60 * 60 * 1000 });

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while logging in' });
        console.log('error.message', error.message);
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'User profile fetched successfully', user });
    } catch (error) {
        console.log('got error while fetching user profile', error.message)
        res.status(500).json({ error: 'An error occurred while fetching user profile' });
    }
}

const updateProfile = async (req, res) => {
    const { fullName, username, email, password } = req.body
    const userId = req.user.id

    try {
        const user = await UserModel.findById(userId)
        if (!user) return res.status(404).json({ error: 'User not found' });

        // check if the new username or email already exists for another user
        const conditions = [];
        if (username) conditions.push({ username });
        if (email) conditions.push({ email });
        if (conditions.length) {
            const existingUser = await UserModel.findOne({
                _id: { $ne: userId },
                $or: conditions
            });

            if (existingUser) {
                if (existingUser.username === username) return res.status(409).json({ error: "This username is not available" });
                if (existingUser.email === email) return res.status(409).json({ error: "User with this email already exists" });
            }
        }

        // Update user fields
        user.fullName = fullName || user.fullName;
        user.username = username || user.username;
        user.email = email || user.email;

        // Update password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        user.password = undefined; // Exclude password from the response

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.log('got error while updating profile', error.message)
        res.status(500).json({ error: 'An error occurred while updating profile' });
    }
}

const logoutUser = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await UserModel.findById(userId)
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.status = 'logout';
        await user.save();

        res.clearCookie('token');

        res.status(200).json({ message: 'Logged out successfully', user });
    } catch (error) {
        console.log('got error while logging out', error.message)
        res.status(500).json({ error: 'An error occurred while logging out' });
    }
}

module.exports = { registerUser, loginUser, getUserProfile, updateProfile, logoutUser };