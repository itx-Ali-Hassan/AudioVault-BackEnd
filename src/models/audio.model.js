const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    audioUrl: { type: String, required: true },
    audioPublicID: { type: String, required: true },
    coverUrl: { type: String, required: true },
    coverPublicID: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;