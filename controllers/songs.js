const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');


const getAll = async(req,res) => {
    //#swagger.tags=['Songs']
    try {
        const result = await mongodb.getDatabase().collection('songs').find();
        result.toArray().then((songs) => {
            res.setHeader('Content-type', 'application/json');
            res.status(200).json(songs);
        })
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

};

const getSong = async(req,res) => {
    //#swagger.tags=['Songs']
    try {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(404).json('Song not found.')
    };
    const songId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().collection('songs').find({ _id: songId });
    result.toArray().then((songs) => {
        res.setHeader('Content-type', 'application/json');
        res.status(200).json(songs[0]);
    });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

};

const createSong = async (req, res) => {    
    //#swagger.tags=['Songs']
    try {
        const song = {
            title: req.body.title,
            artist: req.body.artist,
            category: req.body.category,
            album: req.body.album,
            release_year: req.body.release_year,
            featured_in: req.body.featured_in,
            mood: req.body.mood
        };

        const response = await mongodb.getDatabase().collection('songs').insertOne(song);        

        if (response.acknowledged) {
            res.status(201).json({ 
                message: 'Song created successfully!',
                songId: response.insertedId
            });
        } else {
            res.status(500).json(response.error || 'Some error occurred while creating the song.');
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};



const updateSong = async(req,res) => {
    //#swagger.tags=['Songs']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(404).json('Song not found.')
        };
        const songId = new ObjectId(req.params.id);   
        const song = {
            title: req.body.title,
            artist: req.body.artist,
            category: req.body.category,
            album: req.body.album,
            release_year: req.body.release_year,
            featured_in: req.body.featured_in,
            mood: req.body.mood
        };
        const response = await mongodb.getDatabase().collection('songs').replaceOne({ _id: songId }, song);
        if (response.modifiedCount > 0) {
            res.status(201).json({ 
                message: 'Song updated successfully!'                
            });
        } else {
            res.status(500).json(response.error || 'Some error occurred while updating the song.');
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

};

const deleteSong = async(req,res) => {
    //#swagger.tags=['Songs']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(404).json('Song not found.')
        };
        const songId = new ObjectId(req.params.id); 
        const response = await mongodb.getDatabase().collection('songs').deleteOne({ _id: songId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Song deleted successfully' });
        } else {
            res.status(500).json(response.error || 'Some error occurred while updating the song.');
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

};

module.exports = {
    getAll,
    getSong,
    createSong,
    updateSong,
    deleteSong
};