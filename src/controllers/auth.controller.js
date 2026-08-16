const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const UserModel = require('../models/user.model')
const sendEmail = require('../utils/sendEmail.util')

const createToken = (id, email) => { return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "30d" }) }

const otp = async (req, res) => {
    const { email } = req.body
    const message = `
    <div style="margin:0;padding:0;background-color:#121217;font-family:Arial,Helvetica,sans-serif;color:#F5F5F7;">
  <div style="padding:40px 15px;">
    <div style="max-width:600px;margin:0 auto;background-color:#1A1A21;border:1px solid #2A2A33;border-radius:16px;overflow:hidden;">

  <div style="padding:32px 35px 20px;text-align:center;">
    <div style="font-size:28px;font-weight:700;color:#F5F5F7;">
      Audio<span style="color:#A78BFA;">Vault</span>
    </div>
    <div style="margin-top:10px;font-size:13px;color:#8F8F9D;letter-spacing:1px;">
      SECURE ACCESS
    </div>
  </div>

  <div style="height:1px;background-color:#2A2A33;margin:0 35px;"></div>

  <div style="padding:35px;">
    <h1 style="margin:0 0 15px;font-size:25px;color:#F5F5F7;">
      Verify your account 🔐
    </h1>

    <p style="margin:0 0 25px;font-size:16px;line-height:1.7;color:#B8B8C2;">
      Use the verification code below to continue with your AudioVault account.
    </p>

    <div style="padding:22px;text-align:center;background-color:#121217;border:1px solid #2A2A33;border-radius:12px;">
      <div style="font-size:36px;font-weight:700;letter-spacing:8px;color:#A78BFA;">
        ${req.body.otp}
      </div>
    </div>

    <p style="margin:22px 0 0;font-size:14px;line-height:1.6;color:#8F8F9D;">
      This code will expire in <strong style="color:#F5F5F7;">10 minutes</strong>.
    </p>

    <p style="margin:15px 0 0;font-size:13px;line-height:1.6;color:#686873;">
      If you didn't request this code, you can safely ignore this email.
      Never share your verification code with anyone.
    </p>
  </div>

  <div style="padding:20px 35px;background-color:#17171D;border-top:1px solid #2A2A33;text-align:center;">
    <p style="margin:0;font-size:12px;color:#686873;">
      © 2026 AudioVault · Keep your vault secure 🎧
    </p>
  </div>

</div>

  </div>
</div>

    `
    await sendEmail(email, 'Your AudioVault verification code', message)
}

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

        const html =
            `
            <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to AudioVault</title>
</head>

<body style="margin:0; padding:0; background-color:#121217; font-family:Arial, Helvetica, sans-serif; color:#F5F5F7;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#121217; padding:40px 15px;">
        <tr>
            <td align="center">

                <table width="100%" cellpadding="0" cellspacing="0"
                    style="max-width:600px; background-color:#1A1A21; border:1px solid #2A2A33; border-radius:16px; overflow:hidden;">

                    <!-- Header -->
                    <tr>
                        <td style="padding:32px 35px 20px; text-align:center;">

                            <div style="font-size:28px; font-weight:700; letter-spacing:-0.5px; color:#F5F5F7;">
                                Audio<span style="color:#A78BFA;">Vault</span>
                            </div>

                            <div style="margin-top:10px; font-size:13px; color:#8F8F9D; letter-spacing:1px;">
                                YOUR AUDIO. YOUR VAULT.
                            </div>

                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding:0 35px;">
                            <div style="height:1px; background-color:#2A2A33;"></div>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:35px;">

                            <h1 style="margin:0 0 18px; font-size:26px; line-height:1.3; color:#F5F5F7;">
                                Welcome, ${username} 👋
                            </h1>

                            <p style="margin:0 0 18px; font-size:16px; line-height:1.7; color:#B8B8C2;">
                                Your AudioVault account is officially ready.
                            </p>

                            <p style="margin:0 0 25px; font-size:16px; line-height:1.7; color:#B8B8C2;">
                                You've got your own little vault now — a place to upload,
                                manage, and keep your favorite audio in one spot.
                            </p>

                            <!-- CTA -->
                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="border-radius:10px; background-color:#A78BFA;">
                                        <a href="#"
                                            style="display:inline-block; padding:13px 22px; color:#121217; font-size:15px; font-weight:700; text-decoration:none;">
                                            Open AudioVault →
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:30px 0 0; font-size:14px; line-height:1.6; color:#777783;">
                                Thanks for joining us. Now go make some noise. 🎧
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:20px 35px; background-color:#17171D; border-top:1px solid #2A2A33; text-align:center;">

                            <p style="margin:0; font-size:12px; color:#686873;">
                                © 2026 AudioVault · Built for audio lovers
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
        `

        await sendEmail(email, 'Welcome to AudioVault', html)

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

        const html = `<div style="margin:0;padding:0;background-color:#121217;font-family:Arial,Helvetica,sans-serif;color:#F5F5F7;">
  <div style="padding:40px 15px;">
    <div style="max-width:600px;margin:0 auto;background-color:#1A1A21;border:1px solid #2A2A33;border-radius:16px;overflow:hidden;">

  <!-- Header -->
  <div style="padding:32px 35px 20px;text-align:center;">
    <div style="font-size:28px;font-weight:700;color:#F5F5F7;">
      Audio<span style="color:#A78BFA;">Vault</span>
    </div>

    <div style="margin-top:10px;font-size:13px;color:#8F8F9D;letter-spacing:2px;">
      ACCOUNT SECURITY
    </div>
  </div>

  <div style="height:1px;background-color:#2A2A33;margin:0 35px;"></div>

  <!-- Content -->
  <div style="padding:35px;">

    <h1 style="margin:0 0 18px;font-size:26px;line-height:1.3;color:#F5F5F7;">
      Welcome back 👋
    </h1>

    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#B8B8C2;">
      Hey <strong style="color:#F5F5F7;">{{username}}</strong>,
    </p>

    <p style="margin:0 0 25px;font-size:16px;line-height:1.7;color:#B8B8C2;">
      You just logged in to your AudioVault account successfully. 🎧
    </p>

    <!-- Login Info -->
    <div style="padding:20px;background-color:#121217;border:1px solid #2A2A33;border-radius:12px;">

      <div style="margin-bottom:14px;">
        <span style="font-size:13px;color:#777783;">LOGIN TIME</span>
        <div style="margin-top:5px;font-size:15px;color:#F5F5F7;">
          {{loginTime}}
        </div>
      </div>

      <div>
        <span style="font-size:13px;color:#777783;">DEVICE</span>
        <div style="margin-top:5px;font-size:15px;color:#F5F5F7;">
          {{device}}
        </div>
      </div>

    </div>

    <!-- Security Warning -->
    <div style="margin-top:20px;padding:18px;background-color:#201B27;border:1px solid #3A3048;border-radius:12px;">
      <div style="font-size:15px;font-weight:700;color:#A78BFA;margin-bottom:7px;">
        🔐 Wasn't you?
      </div>

      <div style="font-size:14px;line-height:1.6;color:#B8B8C2;">
        If you didn't log in to your AudioVault account, please secure your account immediately.
      </div>
    </div>

    <p style="margin:25px 0 0;font-size:14px;line-height:1.6;color:#777783;">
      Stay safe and keep your vault secure. 🎧
    </p>

  </div>

  <!-- Footer -->
  <div style="padding:20px 35px;background-color:#17171D;border-top:1px solid #2A2A33;text-align:center;">
    <p style="margin:0;font-size:12px;color:#686873;">
      © 2026 AudioVault · All rights reserved.
    </p>

    <p style="margin:8px 0 0;font-size:12px;color:#686873;">
      Your audio. Your vault.
    </p>
  </div>

</div>

  </div>
</div>
`

        await sendEmail(email, 'New login to your AudioVault account', html)

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