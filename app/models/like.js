const db = require('../configs/dbconfig');

async function getLikes(post_id) {
  const query = `
    SELECT COUNT(*) AS likes
    FROM likes
    WHERE post_id = $1
  `;

  const values = [post_id];

  try {
    const result = await db.query(query, values);
    return result.rows[0].likes;
  } catch (error) {
    console.error('Error getting likes:', error);
    throw error;
  }
}

async function createLike(post_id, user_id) {
  const query = `
    INSERT INTO likes (user_id, post_id)
    VALUES ($1, $2)
  `;

  const values = [user_id, post_id];

  try {
    await db.query(query, values);
  } catch (error) {
    console.error('Error inserting a new like:', error);
    throw error;
  }
}

module.exports = {
  getLikes,
  createLike,
};
