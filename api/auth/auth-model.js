const db = require('../../data/dbConfig');

const add = async (user) => {
    await db('users').insert(user);
    return db('users').where('username', user.username);
}

module.exports = {
    add
}