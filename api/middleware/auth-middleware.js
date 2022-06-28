const db = require('../../data/dbConfig');

const checkPayload = (req, res, next) => {
    const {username, password} = req.body;
    if (!username || username === undefined || !password || password === undefined) {
        res.status(400).json({message: 'username and password are required'});
    } else {
        next();
    }
}

const checkUsernameFree = async (req, res, next) => {
    const existing = await db('users').where('username', req.body.username).first();
    if (existing) {
        res.status(400).json({message: 'username taken'});
    } else {
        next();
    }
}

const checkUsernameExists = async (req, res, next) => {
    const existing = await db('users').where('username', req.body.username).first();
    if (!existing) {
        res.status(400).json({message: 'invalid credentials'});
    } else {
        req.user = existing;
        next();
    }
}

module.exports = {
    checkPayload,
    checkUsernameFree,
    checkUsernameExists
}