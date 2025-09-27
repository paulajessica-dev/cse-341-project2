const mongodb = require('../data/database');

async function addTokenToBlacklist(token) {
  const db = mongodb.getDatabase().client.db('project2');
  await db.collection('blacklist').insertOne({ token, createdAt: new Date() });
}

async function isTokenBlacklisted(token) {
  const db = mongodb.getDatabase().client.db('project2');
  const blacklisted = await db.collection('blacklist').findOne({ token });
  return !!blacklisted;
}

module.exports = { addTokenToBlacklist, isTokenBlacklisted };
