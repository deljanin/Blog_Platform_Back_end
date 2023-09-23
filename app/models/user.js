const db = require('../config/dbconfig');

async function findByEmail(email) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  try {
    const result = await db.query(query);
    return result.rows[0]; // Return the user with the specified ID
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

async function create(username, email, password, role) {
  const query = `INSERT INTO users (username, email, password, role) VALUES ('${username}','${email}','${password}','${role}') RETURNING *`;
  console.log(query);
  try {
    const result = await db.query(query);
    return result.rows[0]; // Return the newly created user
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

module.exports = {
  create,
  findByEmail,
};
