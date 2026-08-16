const Audio = require('../models/audio.model');

const audioOwnerMiddleware = async (req, res, next) => {
    try {
        const audio = await Audio.findById(req.params.id);

        if (!audio) return res.status(404).json({ error: 'Audio not found' });

        if (audio.userId.toString() !== req.user.id) return res.status(403).json({ error: 'You do not own this audio ( UnAuthorize )' });

        req.audio = audio;
        next();
    } catch (error) {
        console.log('Error checking audio ownership:', error.message);
        return res.status(500).json({ error: 'An error occurred while checking audio ownership' });
    }
};

module.exports = audioOwnerMiddleware;