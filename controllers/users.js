const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



console.log('SECRET_KEY =', process.env.SECRET_KEY);

const getAll = async(req,res) => {
    //#swagger.tags=['Users']
    try {
        const result = await mongodb.getDatabase().collection('users').find();
        result.toArray().then((users) => {
            res.setHeader('Content-type', 'application/json');
            res.status(200).json(users);
        })
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

};

const getSingle = async(req,res) => {
    //#swagger.tags=['Users']
    try {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(404).json('User not found.')
    };
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().collection('users').find({ _id: userId });
    result.toArray().then((users) => {
        res.setHeader('Content-type', 'application/json');
        res.status(200).json(users[0]);
    });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

};

const createUser = async(req,res) => {    
    //#swagger.tags=['Users']
    try {
        const { firstName, lastName, email, favoriteColor, birthday, password } = req.body;
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = {
            firstName,
            lastName,
            email,
            favoriteColor: favoriteColor || '',
            birthday: birthday || null,
            password: passwordHash
        };
        const response = await mongodb.getDatabase().collection('users').insertOne(user);
        const secret = process.env.SECRET_KEY; 
        if (!secret) {
            return res.status(500).json({ message: 'SECRET_KEY is not defined in environment variables' });
        }
        const token = jwt.sign({ id: response.insertedId }, secret, { expiresIn: '1h' });
             

        if (response.acknowledged) {
            res.status(201).json({ 
                message: 'User created successfully!',
                userId: response.insertedId,
                token
            });
        } else {
            res.status(500).json(response.error || 'Some error occurred while updating the user.');
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }


};


const updateUser = async(req,res) => {
    //#swagger.tags=['Users']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(404).json('User not found.')
        };
        const userId = new ObjectId(req.params.id);   
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,    
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
        };
        const response = await mongodb.getDatabase().collection('users').replaceOne({ _id: userId }, user);
        if (response.modifiedCount > 0) {
            res.status(201).json({ 
                message: 'User updated successfully!'                
            });
        } else {
            res.status(500).json(response.error || 'Some error occurred while updating the user.');
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

};

const deleteUser = async(req,res) => {
    //#swagger.tags=['Users']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(404).json('User not found.')
        };
        const userId = new ObjectId(req.params.id); 
        const response = await mongodb.getDatabase().collection('users').deleteOne({ _id: userId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(500).json(response.error || 'Some error occurred while updating the user.');
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};