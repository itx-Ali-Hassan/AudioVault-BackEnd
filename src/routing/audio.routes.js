const express = require('express')

const { uploadAudio, getAudioById, getAllAudios, deleteAudio, updateAudio, getYourAudios } = require('../controllers/audio.controller')
const audioMiddleware = require('../middleware/audio.middleware')
const authMiddleware = require('../middleware/auth.middleware')
const uploadMiddleware = require('../middleware/upload.middleware')

const router = express.Router()

router.route('/audio')
    .post(
        authMiddleware,
        uploadMiddleware.fields([
            { name: 'audioFile', maxCount: 1 },
            { name: 'coverFile', maxCount: 1 },
        ]),
        uploadAudio)
    .get(getAllAudios)

router.route('/audio/:id')
    .get(getAudioById)
    .put(
        authMiddleware,
        audioMiddleware,
        uploadMiddleware.fields([
            { name: 'coverFile', maxCount: 1 },
        ]),
        updateAudio
    )
    .delete(
        authMiddleware,
        audioMiddleware,
        deleteAudio
    )

router.get('/audio/my', authMiddleware, getYourAudios)

module.exports = router