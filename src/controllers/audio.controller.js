const cloudinary = require('../db/cloudinary')
const audioModel = require('../models/audio.model')

const uploadToCloudinary = (buffer, resource_type = 'image') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'AudioVault', resource_type },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        stream.end(buffer);
    });
}

const destroyFromCloudinary = async (publicId, resource_type = 'image') => {
    await cloudinary.uploader.destroy(publicId, { resource_type })
}

const uploadAudio = async (req, res) => {
    const { title, description } = req.body

    const audioFile = req.files.audioFile[0];
    const coverFile = req.files.coverFile?.[0];

    try {
        const audioUrl = await uploadToCloudinary(audioFile.buffer, 'video');

        let coverUrl;
        let coverPublicID = null;

        if (coverFile) {
            const cover = await uploadToCloudinary(coverFile.buffer);
            coverUrl = cover.secure_url;
            coverPublicID = cover.public_id;
        } else {
            coverUrl = `https://placehold.co/600/121217/F5F5F7/WebP?text=${title.replaceAll(' ', '+')}&font=lora`;
        }

        const audio = await audioModel.create({
            title,
            description,
            audioUrl: audioUrl.secure_url,
            audioPublicID: audioUrl.public_id,
            coverUrl,
            coverPublicID,
            userId: req.user.id
        })
        res.status(201).json({ message: 'Audio & Cover uploaded to DB', audio })
    } catch (error) {
        console.log('got an error while uploading the files', error.message)
        res.status(500).json({ message: 'Got an error while uploading the files' })
    }
}

const getAllAudios = async (req, res) => {
    try {
        const audios = await audioModel.find()
        res.status(200).json({ message: 'Audios fetched successfully 😎', audios })
    } catch (error) {
        console.log('got an error while fetching the Audios', error.message)
        res.status(500).json({ message: 'Got an error while fetching the Audios' })
    }
}

const getAudioById = async (req, res) => {
    const { id } = req.params
    try {
        const audio = await audioModel.findById(id)
        if (!audio) return res.status(404).json({ message: 'Audio not found' })
        res.status(200).json({ message: 'Audio fetched successfully 😎', audio })
    } catch (error) {
        console.log('got an error while fetching the Audio', error.message)
        res.status(500).json({ message: 'Got an error while fetching the Audio' })
    }
}

const updateAudio = async (req, res) => {
    const { id } = req.params
    const { title, description } = req.body

    const coverFile = req.files.coverFile?.[0];

    try {
        const audio = await audioModel.findById(id)
        if (!audio) return res.status(404).json({ message: 'Audio not found' })

        if (coverFile) {
            await destroyFromCloudinary(audio.coverPublicID, 'image')
            const coverUrl = await uploadToCloudinary(coverFile.buffer)
            audio.coverUrl = coverUrl.secure_url
            audio.coverPublicID = coverUrl.public_id
        }

        audio.title = title || audio.title
        audio.description = description || audio.description

        await audio.save()
        res.status(200).json({ message: 'Audio updated successfully 😎', audio })
    } catch (error) {
        console.log('got an error while updating the Audio', error.message)
        res.status(500).json({ message: 'Got an error while updating the Audio' })
    }
}

const deleteAudio = async (req, res) => {
    const { id } = req.params

    try {
        const audio = await audioModel.findById(id)
        if (!audio) return res.status(404).json({ message: 'Audio not found' })

        await destroyFromCloudinary(audio.audioPublicID, 'video')
        await destroyFromCloudinary(audio.coverPublicID, 'image')

        await audio.deleteOne()
        res.status(200).json({ message: 'Audio deleted successfully 😎', audio })
    } catch (error) {
        console.log('got an error while deleting the Audio', error.message)
        res.status(500).json({ message: 'Got an error while deleting the Audio' })
    }
}

const getYourAudios = async (req, res) => {
    try {
        const audios = await audioModel.find({ userId: req.user.id })
        res.status(200).json({ message: 'Your audios fetched successfully 😎', audios })
    } catch (error) {
        console.log('got an error while fetching your Audios', error.message)
        res.status(500).json({ message: 'Got an error while fetching your Audios' })
    }
}

module.exports = { uploadAudio, getAudioById, getAllAudios, deleteAudio, updateAudio, getYourAudios }