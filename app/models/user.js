const db = require('../configs/dbconfig');

async function findByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  try {
    const result = await db.query(query, [email]);
    return result.rows[0]; // Return the user with the specified email
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

async function findOneById(userId) {
  const query = `
    SELECT *
    FROM users
    WHERE user_id = $1;
  `;

  const result = await db.query(query, [userId]);

  if (result.rows.length === 0) {
    return null; // User not found
  }

  return result.rows[0];
}

async function createUser(username, email, password, role) {
  const query =
    'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
  try {
    const result = await db.query(query, [username, email, password, role]);
    return result.rows[0]; // Return the newly created user
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function flagUser(userId) {
  const query = `
    UPDATE users
    SET flag = true
    WHERE user_id = $1;
  `;

  await db.query(query, [userId]);
}

async function flagUserByEmail(userEmail) {
  const query = `
    UPDATE users
    SET flag = true
    WHERE email = $1;
  `;

  await db.query(query, [userEmail]);
}

async function deleteUserById(userId) {
  const query = `
    DELETE FROM users
    WHERE user_id = $1;
  `;

  try {
    await db.query(query, [userId]);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

module.exports = {
  findByEmail,
  findOneById,
  createUser,
  flagUser,
  flagUserByEmail,
  deleteUserById,
};
