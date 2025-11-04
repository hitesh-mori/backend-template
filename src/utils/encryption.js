const argon2 = require('argon2');
const config = require('../config/environment');

const hashPassword = async (plainPassword) => {
  try {
    return await argon2.hash(plainPassword, {
      type: argon2.argon2id,
      memoryCost: config.ARGON2_MEMORY_COST,
      timeCost: config.ARGON2_TIME_COST,
      parallelism: config.ARGON2_PARALLELISM,
    });
  } catch (error) {
    throw new Error('Password hashing failed');
  }
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (error) {
    return false;
  }
};

module.exports = { hashPassword, verifyPassword };
